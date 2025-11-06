import type { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { enhance } from "../enhance"
import { fromNotionBlocks } from "../from-notion-block/from-notion-blocks"
import type { NotionPropertyConverter } from "../table/notion-property-converter"
import type { Schema, SchemaType } from "../types"

type Props<S extends Schema> = {
  readonly notion: Client
  readonly schema: S
  readonly converter: NotionPropertyConverter
  readonly rawData: PageObjectResponse
}

/**
 * Notion ページへの参照を表すクラス
 */
export class NotionPageReference<S extends Schema> {
  constructor(private readonly props: Props<S>) {
    Object.freeze(this)
  }

  get id() {
    return this.props.rawData.id
  }

  get url() {
    return this.props.rawData.url
  }

  get createdAt() {
    return this.props.rawData.created_time
  }

  get updatedAt() {
    return this.props.rawData.last_edited_time
  }

  get isArchived() {
    return this.props.rawData.archived
  }

  get isDeleted() {
    return this.props.rawData.archived
  }

  /**
   * テーブルのプロパティを取得
   */
  properties(): SchemaType<S> {
    return this.props.converter.fromNotion(
      this.props.schema,
      this.props.rawData.properties,
    )
  }

  /**
   * 元のNotionページデータを取得
   */
  raw(): PageObjectResponse {
    return this.props.rawData
  }

  /**
   * ページの本文をマークダウン形式で取得
   */
  async body(): Promise<string> {
    const blocks = await enhance(this.props.notion.blocks.children.list)({
      block_id: this.props.rawData.id,
    })

    return fromNotionBlocks(blocks)
  }
}
