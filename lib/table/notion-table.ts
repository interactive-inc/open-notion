import type { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { PageReference } from "@/modules/page-reference"
import { QueryResult } from "@/modules/query-result"
import { NotionMarkdown } from "@/table/notion-markdown"
import { NotionMemoryCache } from "@/table/notion-memory-cache"
import { NotionPropertyConverter } from "@/table/notion-property-converter"
import { NotionQueryBuilder } from "@/table/notion-query-builder"
import { NotionSchemaValidator } from "@/table/notion-schema-validator"
import { toNotionBlocks } from "@/to-notion-block/to-notion-blocks"
import type {
  BatchResult,
  FindOptions,
  NotionPage,
  Schema,
  SchemaType,
  SortOption,
  TableHooks,
  TableRecord,
  UpdateManyOptions,
  UpsertOptions,
  WhereCondition,
} from "@/types"

export class NotionTable<T extends Schema> {
  private readonly client: Client
  private readonly tableId: string
  private readonly schema: T
  private readonly cache: NotionMemoryCache
  private readonly validator: NotionSchemaValidator
  private readonly queryBuilder: NotionQueryBuilder
  private readonly converter: NotionPropertyConverter
  private readonly enhancer: NotionMarkdown
  public hooks: TableHooks<T> = {}

  constructor(options: {
    client: Client
    tableId: string
    schema: T
    cache?: NotionMemoryCache
    validator?: NotionSchemaValidator
    queryBuilder?: NotionQueryBuilder
    converter?: NotionPropertyConverter
    enhancer?: NotionMarkdown
  }) {
    this.client = options.client
    this.tableId = options.tableId
    this.schema = options.schema
    this.cache = options.cache || new NotionMemoryCache()
    this.validator = options.validator || new NotionSchemaValidator()
    this.queryBuilder = options.queryBuilder || new NotionQueryBuilder()
    this.converter = options.converter || new NotionPropertyConverter()
    this.enhancer = options.enhancer || new NotionMarkdown()
  }

  async findMany(
    options: FindOptions<T> = {},
  ): Promise<PageReference<TableRecord<SchemaType<T>>>[]> {
    const { where = {}, count = 100, sorts } = options

    const maxCount = Math.min(Math.max(1, count), 1024)
    const pageSize = Math.min(maxCount, 100)

    const notionFilter =
      Object.keys(where).length > 0
        ? this.queryBuilder?.buildFilter(this.schema, where)
        : undefined

    const notionSort = this.buildNotionSort(sorts)

    const allRecords = await this.fetchAllRecords(
      maxCount,
      pageSize,
      notionFilter,
      notionSort,
    )

    return allRecords.pageReferences()
  }

  async findOne(
    options: FindOptions<T> = {},
  ): Promise<PageReference<TableRecord<SchemaType<T>>> | null> {
    const result = await this.findMany({
      ...options,
      count: 1,
    })
    return result[0] || null
  }

  async findById(
    id: string,
    options?: { cache?: boolean },
  ): Promise<TableRecord<SchemaType<T>> | null> {
    const cacheKey = `page:${id}`

    if (options?.cache) {
      const cached = this.cache?.get<TableRecord<SchemaType<T>>>(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      const response = await this.client.pages.retrieve({ page_id: id })
      const record = this.convertPageToRecord(response as unknown as NotionPage)

      if (options?.cache) {
        this.cache?.set(cacheKey, record)
      }

      return record
    } catch {
      return null
    }
  }

  async create(
    data: Partial<SchemaType<T>> & { body?: string },
  ): Promise<TableRecord<SchemaType<T>>> {
    this.validator?.validate(this.schema, data)

    const processedData = this.hooks.beforeCreate
      ? await this.hooks.beforeCreate(data)
      : data

    if (!this.converter) {
      throw new Error("Converter is not initialized")
    }

    const properties = this.converter?.toNotion(this.schema, processedData)

    let children: unknown[] | undefined
    if (processedData.body) {
      const blocks = toNotionBlocks(processedData.body as string)
      children = blocks.map((block) => {
        if ("type" in block && typeof block.type === "string") {
          const enhancedType = this.enhancer.enhanceBlockType(block.type)
          return { ...block, type: enhancedType } as typeof block
        }
        return block
      })
    }

    const response = await this.client.pages.create({
      parent: { database_id: this.tableId },
      properties: properties as never,
      children: children as never,
    })

    const record = await this.findById(response.id)
    if (!record) {
      throw new Error("Failed to retrieve created record")
    }

    if (this.hooks.afterCreate) {
      await this.hooks.afterCreate(record)
    }

    return record
  }

  async createMany(
    records: Array<Partial<SchemaType<T>> & { body?: string }>,
  ): Promise<BatchResult<TableRecord<SchemaType<T>>>> {
    const results = await Promise.allSettled(
      records.map((record) => this.create(record)),
    )

    const succeeded: TableRecord<SchemaType<T>>[] = []
    const failed: Array<{
      data: Partial<SchemaType<T>> & { body?: string }
      error: Error
    }> = []

    for (const [index, result] of results.entries()) {
      if (result.status === "fulfilled") {
        succeeded.push(result.value)
        continue
      }

      const record = records[index]
      if (record) {
        failed.push({
          data: record,
          error:
            result.reason instanceof Error
              ? result.reason
              : new Error(String(result.reason)),
        })
      }
    }

    return { succeeded, failed }
  }

  async update(
    id: string,
    data: Partial<SchemaType<T>> & { body?: string | null },
  ): Promise<void> {
    this.validator?.validate(this.schema, data, { skipRequired: true })

    const processedData = this.hooks.beforeUpdate
      ? await this.hooks.beforeUpdate(id, data)
      : data

    if (!this.converter) {
      throw new Error("Converter is not initialized")
    }

    const properties = this.converter.toNotion(this.schema, processedData)

    await this.client.pages.update({
      page_id: id,
      properties: properties as never,
    })

    if (processedData.body) {
      await this.updatePageContent(id, processedData.body as string)
    }

    this.cache?.delete(`page:${id}`)

    if (this.hooks.afterUpdate) {
      const record = await this.findById(id)
      if (record) {
        await this.hooks.afterUpdate(id, record)
      }
    }
  }

  async updateMany(options: UpdateManyOptions<T>): Promise<number> {
    const { where = {}, update, count = 1024 } = options

    const result = await this.findMany({ where, count })

    let updated = 0
    for (const record of result) {
      await this.update(record.properties().id, update)
      updated++
    }

    return updated
  }

  async upsert(options: UpsertOptions<T>): Promise<TableRecord<SchemaType<T>>> {
    const { where, insert = {}, update } = options

    const existingRecord = await this.findOne({ where })

    if (existingRecord) {
      await this.update(existingRecord.properties().id, update)
      const updated = await this.findById(existingRecord.properties().id)
      return updated as TableRecord<SchemaType<T>>
    }

    const createData = { ...where, ...insert } as Partial<SchemaType<T>>
    return await this.create(createData)
  }

  async deleteMany(where: WhereCondition<T> = {}): Promise<number> {
    const result = await this.findMany({ where, count: 1024 })

    let deleted = 0
    for (const record of result) {
      await this.delete(record.properties().id)
      deleted++
    }

    return deleted
  }

  async delete(id: string): Promise<void> {
    if (this.hooks.beforeDelete) {
      await this.hooks.beforeDelete(id)
    }

    await this.client.pages.update({
      page_id: id,
      archived: true,
    })

    this.cache?.delete(`page:${id}`)

    if (this.hooks.afterDelete) {
      await this.hooks.afterDelete(id)
    }
  }

  async restore(id: string): Promise<void> {
    await this.client.pages.update({
      page_id: id,
      archived: false,
    })

    this.cache?.delete(`page:${id}`)
  }

  clearCache(): void {
    this.cache?.clear()
  }

  private buildNotionSort(
    sorts: SortOption<T> | SortOption<T>[] | undefined,
  ): Array<Record<string, unknown>> {
    if (!sorts) {
      return []
    }
    const sortArray = Array.isArray(sorts) ? sorts : [sorts]
    return this.queryBuilder?.buildSort(sortArray) || []
  }

  private async fetchAllRecords(
    maxCount: number,
    pageSize: number,
    notionFilter: Record<string, unknown> | undefined,
    notionSort: Array<Record<string, unknown>>,
  ): Promise<QueryResult<TableRecord<SchemaType<T>>>> {
    const allPageReferences: PageReference<TableRecord<SchemaType<T>>>[] = []
    let nextCursor: string | null = null
    let hasMore = true

    while (hasMore && allPageReferences.length < maxCount) {
      const response = await this.client.databases.query({
        database_id: this.tableId,
        filter: notionFilter as never,
        sorts: notionSort.length > 0 ? (notionSort as never) : undefined,
        start_cursor: nextCursor || undefined,
        page_size: pageSize,
      })

      const pageReferences = response.results.map((page) => {
        return this.convertPageToPageReference(page as PageObjectResponse)
      })

      allPageReferences.push(...pageReferences)
      nextCursor = response.next_cursor
      hasMore = response.has_more && allPageReferences.length < maxCount
    }

    if (allPageReferences.length > maxCount) {
      return new QueryResult({
        pageReferences: allPageReferences.slice(0, maxCount),
        cursor: nextCursor,
        hasMore,
      })
    }

    return new QueryResult({
      pageReferences: allPageReferences,
      cursor: nextCursor,
      hasMore,
    })
  }

  private convertPageToRecord(page: NotionPage): TableRecord<SchemaType<T>> {
    if (!this.converter) {
      throw new Error("Converter is not initialized")
    }
    const data = this.converter.fromNotion(
      this.schema,
      page.properties as PageObjectResponse["properties"],
    )
    return {
      id: page.id,
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
      isDeleted: page.archived,
      ...data,
    } as TableRecord<SchemaType<T>>
  }

  private convertPageToPageReference(
    page: PageObjectResponse,
  ): PageReference<TableRecord<SchemaType<T>>> {
    if (!this.converter) {
      throw new Error("Converter is not initialized")
    }
    const data = this.converter.fromNotion(this.schema, page.properties)

    const properties = {
      id: page.id,
      createdAt: page.created_time,
      updatedAt: page.last_edited_time,
      isDeleted: page.archived,
      ...data,
    } as TableRecord<SchemaType<T>>

    return new PageReference({
      notion: this.client,
      pageId: page.id,
      properties,
      rawData: page,
    })
  }

  private async updatePageContent(id: string, content: string): Promise<void> {
    const blocksResult = await this.client.blocks.children.list({
      block_id: id,
    })

    for (const block of blocksResult.results) {
      await this.client.blocks.delete({
        block_id: block.id,
      })
    }

    const blocks = toNotionBlocks(content)
    const enhancedBlocks = blocks.map((block) => {
      if ("type" in block && typeof block.type === "string") {
        const enhancedType = this.enhancer.enhanceBlockType(block.type)
        return { ...block, type: enhancedType } as typeof block
      }
      return block
    })

    await this.client.blocks.children.append({
      block_id: id,
      children: enhancedBlocks as never,
    })
  }
}
