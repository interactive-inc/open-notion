import type { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { enhance } from "../enhance"
import { fromNotionBlocks } from "../from-notion-block/from-notion-blocks"

type Props<T> = {
  readonly notion: Client
  readonly pageId: string
  readonly properties: T
  readonly rawData: PageObjectResponse
}

/**
 * Notion ページへの参照を表すクラス
 */
export class PageReference<T> {
  constructor(private readonly props: Props<T>) {
    Object.freeze(this)
  }

  /**
   * テーブルのプロパティを取得
   */
  properties(): T {
    return this.props.properties
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
      block_id: this.props.pageId,
    })

    return fromNotionBlocks(blocks)
  }
}
