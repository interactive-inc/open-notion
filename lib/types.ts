import type { Client } from "@notionhq/client"
import type {
  CreatePageParameters,
  PageObjectResponse,
  UpdatePageParameters,
} from "@notionhq/client/build/src/api-endpoints"
import type { z } from "zod"
import type { zPropertyConfig, zSchema } from "./models"

/* Notion page object type */
export type NotionPage = {
  id: string
  url: string
  created_time: string
  last_edited_time: string
  archived: boolean
  properties: Record<string, unknown>
}

/* Notion base data types */
export type NotionPropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "status"
  | "date"
  | "people"
  | "files"
  | "checkbox"
  | "url"
  | "email"
  | "phone_number"
  | "relation"
  | "created_time"
  | "created_by"
  | "last_edited_time"
  | "last_edited_by"
  | "formula"

/* Notion user type */
export type NotionUser = {
  id: string
  name?: string
  avatar_url?: string
  email?: string
}

/* Notion file type */
export type NotionFile = {
  name: string
  url: string
  type: "file" | "external"
}

/* Date range type */
export type DateRange = {
  start: string
  end: string | null
  timeZone?: string
}

/* Rich text types */
/**
 * Type for rich text item response
 * Includes plain_text field that exists in Notion API response
 */
export type RichTextItemResponse = {
  type: "text"
  text: {
    content: string
    link?: {
      url: string
    } | null
  }
  plain_text: string
  annotations: {
    bold?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
    code?: boolean
    color?:
      | "default"
      | "gray"
      | "brown"
      | "orange"
      | "yellow"
      | "green"
      | "blue"
      | "purple"
      | "pink"
      | "red"
      | "gray_background"
      | "brown_background"
      | "orange_background"
      | "yellow_background"
      | "green_background"
      | "blue_background"
      | "purple_background"
      | "pink_background"
      | "red_background"
  }
}

/**
 * Type for rich text item request
 * Used when sending data to Notion API (does not include plain_text)
 */
export type RichTextItemRequest = {
  type: "text"
  text: {
    content: string
    link?: {
      url: string
    } | null
  }
  annotations?: {
    bold?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
    code?: boolean
    color?:
      | "default"
      | "gray"
      | "brown"
      | "orange"
      | "yellow"
      | "green"
      | "blue"
      | "purple"
      | "pink"
      | "red"
      | "gray_background"
      | "brown_background"
      | "orange_background"
      | "yellow_background"
      | "green_background"
      | "blue_background"
      | "purple_background"
      | "pink_background"
      | "red_background"
  }
}

/* Common property config */
type BasePropertyConfig = {
  required?: boolean
  validate?: (value: unknown) => boolean | string
}

/* Number format type */
type NumberFormat =
  | "number"
  | "number_with_commas"
  | "percent"
  | "dollar"
  | "euro"
  | "pound"
  | "yen"
  | "ruble"
  | "rupee"
  | "won"
  | "yuan"

export type TitlePropertyConfig = BasePropertyConfig & {
  type: "title"
}

export type RichTextPropertyConfig = BasePropertyConfig & {
  type: "rich_text"
}

export type NumberPropertyConfig = BasePropertyConfig & {
  type: "number"
  format?: NumberFormat
  min?: number
  max?: number
}

export type SelectPropertyConfig = BasePropertyConfig & {
  type: "select"
  options: readonly string[] | string[]
}

export type MultiSelectPropertyConfig = BasePropertyConfig & {
  type: "multi_select"
  options: string[] | null
}

export type StatusPropertyConfig = BasePropertyConfig & {
  type: "status"
  options: readonly string[] | string[]
}

export type DatePropertyConfig = BasePropertyConfig & {
  type: "date"
}

export type PeoplePropertyConfig = BasePropertyConfig & {
  type: "people"
}

export type FilesPropertyConfig = BasePropertyConfig & {
  type: "files"
}

export type CheckboxPropertyConfig = BasePropertyConfig & {
  type: "checkbox"
}

export type UrlPropertyConfig = BasePropertyConfig & {
  type: "url"
}

export type EmailPropertyConfig = BasePropertyConfig & {
  type: "email"
}

export type PhoneNumberPropertyConfig = BasePropertyConfig & {
  type: "phone_number"
}

export type RelationPropertyConfig = BasePropertyConfig & {
  type: "relation"
  database_id: string
  single_property?: boolean
}

export type CreatedTimePropertyConfig = BasePropertyConfig & {
  type: "created_time"
}

export type CreatedByPropertyConfig = BasePropertyConfig & {
  type: "created_by"
}

export type LastEditedTimePropertyConfig = BasePropertyConfig & {
  type: "last_edited_time"
}

export type LastEditedByPropertyConfig = BasePropertyConfig & {
  type: "last_edited_by"
}

export type FormulaPropertyConfig = BasePropertyConfig & {
  type: "formula"
  formulaType: "string" | "number" | "boolean" | "date"
}

/* All property config types - inferred from zod */
export type PropertyConfig = z.infer<typeof zPropertyConfig>

/* Database schema definition - inferred from zod */
export type Schema = z.infer<typeof zSchema>

/* Type mapping for schema */
export type PropertyTypeMapping<T extends PropertyConfig> = T extends
  | TitlePropertyConfig
  | RichTextPropertyConfig
  ? string
  : T extends NumberPropertyConfig
    ? number
    : T extends SelectPropertyConfig | StatusPropertyConfig
      ? T["options"] extends readonly (infer U)[]
        ? U
        : T["options"] extends (infer U)[]
          ? U
          : never
      : T extends MultiSelectPropertyConfig
        ? T["options"] extends null
          ? string[]
          : T["options"] extends string[]
            ? T["options"][number][]
            : string[]
        : T extends DatePropertyConfig
          ? DateRange
          : T extends PeoplePropertyConfig
            ? NotionUser[]
            : T extends FilesPropertyConfig
              ? NotionFile[]
              : T extends CheckboxPropertyConfig
                ? boolean
                : T extends
                      | UrlPropertyConfig
                      | EmailPropertyConfig
                      | PhoneNumberPropertyConfig
                  ? string
                  : T extends RelationPropertyConfig
                    ? string[]
                    : T extends
                          | CreatedTimePropertyConfig
                          | LastEditedTimePropertyConfig
                      ? Date
                      : T extends
                            | CreatedByPropertyConfig
                            | LastEditedByPropertyConfig
                        ? NotionUser
                        : T extends FormulaPropertyConfig
                          ? T["formulaType"] extends "string"
                            ? string
                            : T["formulaType"] extends "number"
                              ? number
                              : T["formulaType"] extends "boolean"
                                ? boolean
                                : T["formulaType"] extends "date"
                                  ? DateRange
                                  : never
                          : never

/* Generate type from schema */
export type SchemaType<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true }
    ? PropertyTypeMapping<T[K]>
    : PropertyTypeMapping<T[K]> | null | undefined
}

/* Record type definition */
export type TableRecord<T> = T & {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

/* Page reference type */
export type PageReferenceType<T> = {
  id: string
  url: string
  createdAt: string
  updatedAt: string
  isArchived: boolean
  isDeleted: boolean
  properties(): T
  raw(): PageObjectResponse
  body(): Promise<string>
}

/* Sort option type */
export type SortOption<T extends Schema> = {
  field: keyof SchemaType<T>
  direction: "asc" | "desc"
}

/* Get required field keys */
export type RequiredKeys<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T] &
  keyof SchemaType<T>

/* Required fields type */
export type RequiredFields<T extends Schema> = {
  [K in RequiredKeys<T>]: SchemaType<T>[K]
}

/* Table creation options */
export type TableOptions<T extends Schema> = {
  notion: Client
  tableId: string
  schema: T
}

/* Advanced query operators */
export type QueryOperator<T> = {
  $eq?: T
  $ne?: T
  $gt?: T
  $gte?: T
  $lt?: T
  $lte?: T
  $in?: T[]
  $contains?: T extends string ? string : never
}

export type WhereCondition<T extends Schema> = {
  [K in keyof SchemaType<T>]?:
    | SchemaType<T>[K]
    | QueryOperator<SchemaType<T>[K]>
} & {
  $or?: WhereCondition<T>[]
  $and?: WhereCondition<T>[]
}

export type FindOptions<T extends Schema> = {
  where?: WhereCondition<T>
  count?: number
  sorts?: SortOption<T> | SortOption<T>[]
}

export type CreateInput<T extends Schema> = {
  properties: Pick<SchemaType<T>, RequiredKeys<T>> & Partial<SchemaType<T>>
  body?: string
}

export type UpdateInput<T extends Schema> = {
  properties: Partial<SchemaType<T>>
  body?: string | null
}

export type UpdateManyOptions<T extends Schema> = {
  where?: WhereCondition<T>
  update: UpdateInput<T>
  count?: number
}

export type UpsertOptions<T extends Schema> = {
  where: WhereCondition<T>
  insert: CreateInput<T>
  update: UpdateInput<T>
}

/* Query result type */
export type QueryResult<T> = {
  records: TableRecord<T>[]
  cursor: string | null
  hasMore: boolean
}

/* Batch operation result */
export type BatchResult<T> = {
  succeeded: T[]
  failed: Array<{
    data: unknown
    error: Error
  }>
}

/* Hook definitions */
export type TableHooks<T extends Schema> = {
  beforeCreate?: (data: CreateInput<T>) => Promise<CreateInput<T>>
  afterCreate?: (record: PageReferenceType<SchemaType<T>>) => Promise<void>
  beforeUpdate?: (id: string, data: UpdateInput<T>) => Promise<UpdateInput<T>>
  afterUpdate?: (
    id: string,
    record: PageReferenceType<SchemaType<T>>,
  ) => Promise<void>
  beforeDelete?: (id: string) => Promise<void>
  afterDelete?: (id: string) => Promise<void>
}

/* Cache entry */
export type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
}

/* Cache interface */
export type NotionMemoeryCacheInterface = {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T, ttl?: number): void
  delete(key: string): void
  clear(): void
}

/* Validator interface */
export type ValidatorInterface = {
  validate(schema: Schema, data: unknown): Record<string, unknown>
}

/* Query builder interface */
export type NotionQueryBuilderInterface = {
  buildFilter<T extends Schema>(
    schema: T,
    where: WhereCondition<T>,
  ): Record<string, unknown> | undefined
  buildSort<T extends Schema>(
    sorts: SortOption<T>[],
  ): Array<Record<string, unknown>>
}

/* Converter interface */
export type NotionConverterInterface = {
  fromNotion<T extends Schema>(
    schema: T,
    properties: Record<string, unknown>,
  ): SchemaType<T>
  toNotion<T extends Schema, D extends Partial<SchemaType<T>>>(
    schema: T,
    data: D,
  ): Record<string, unknown>
}

/* Block types */
import type {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"

/**
 * Notion block type constants
 */
export const BlockType = {
  Paragraph: "paragraph",
  Heading1: "heading_1",
  Heading2: "heading_2",
  Heading3: "heading_3",
  BulletedListItem: "bulleted_list_item",
  NumberedListItem: "numbered_list_item",
  Code: "code",
  Quote: "quote",
  Divider: "divider",
  Image: "image",
  Title: "title",
} as const

/**
 * Notion block type union
 */
export type BlockTypeValue = (typeof BlockType)[keyof typeof BlockType]

/**
 * Custom rich text item type
 */
export type CustomRichTextItem = {
  text: {
    content: string
  }
  type: "text"
  plain_text: string
  annotations?: {
    bold?: boolean
    italic?: boolean
    code?: boolean
    strikethrough?: boolean
  }
}

/**
 * Notion block type definition
 */
export type NotionBlock = BlockObjectResponse & {
  children: NotionBlock[]
}

/**
 * Notion bulleted list item block type
 */
export type NotionBulletedListItemBlock =
  BulletedListItemBlockObjectResponse & {
    children: NotionBlock[]
  }

/**
 * Notion numbered list item block type
 */
export type NotionNumberedListItemBlock =
  NumberedListItemBlockObjectResponse & {
    children: NotionBlock[]
  }

/* Notion API Request Property Types */

/**
 * Notion APIのリクエスト用プロパティ型
 */
export type NotionPropertyRequest =
  | NonNullable<CreatePageParameters["properties"]>[string]
  | NonNullable<UpdatePageParameters["properties"]>[string]

/**
 * Notion APIのタイトルプロパティ型
 */
export type NotionTitlePropertyRequest = Extract<
  NotionPropertyRequest,
  { title?: unknown }
>

/**
 * Notion APIのリッチテキストプロパティ型
 */
export type NotionRichTextPropertyRequest = Extract<
  NotionPropertyRequest,
  { rich_text?: unknown }
>

/**
 * Notion APIの数値プロパティ型
 */
export type NotionNumberPropertyRequest = Extract<
  NotionPropertyRequest,
  { number?: unknown }
>

/**
 * Notion APIのチェックボックスプロパティ型
 */
export type NotionCheckboxPropertyRequest = Extract<
  NotionPropertyRequest,
  { checkbox?: unknown }
>

/**
 * Notion APIのセレクトプロパティ型
 */
export type NotionSelectPropertyRequest = Extract<
  NotionPropertyRequest,
  { select?: unknown }
>

/**
 * Notion APIのマルチセレクトプロパティ型
 */
export type NotionMultiSelectPropertyRequest = Extract<
  NotionPropertyRequest,
  { multi_select?: unknown }
>

/**
 * Notion APIの日付プロパティ型
 */
export type NotionDatePropertyRequest = Extract<
  NotionPropertyRequest,
  { date?: unknown }
>

/**
 * Notion APIのURLプロパティ型
 */
export type NotionUrlPropertyRequest = Extract<
  NotionPropertyRequest,
  { url?: unknown }
>

/**
 * Notion APIのメールプロパティ型
 */
export type NotionEmailPropertyRequest = Extract<
  NotionPropertyRequest,
  { email?: unknown }
>

/**
 * Notion APIの電話番号プロパティ型
 */
export type NotionPhoneNumberPropertyRequest = Extract<
  NotionPropertyRequest,
  { phone_number?: unknown }
>

/**
 * Notion APIのリレーションプロパティ型
 */
export type NotionRelationPropertyRequest = Extract<
  NotionPropertyRequest,
  { relation?: unknown }
>

/**
 * Notion APIのピープルプロパティ型
 */
export type NotionPeoplePropertyRequest = Extract<
  NotionPropertyRequest,
  { people?: unknown }
>
