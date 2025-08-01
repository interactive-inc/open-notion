import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"

/**
 * マークダウントークンの型定義
 */
export type MarkdownToken = Tokens.Generic

/**
 * Notionブロックレスポンスの型定義
 */
export type NotionBlockResponse = BlockObjectResponse

/**
 * Notionリッチテキストアイテムの型定義
 */
export type NotionRichTextItem = RichTextItemResponse & {
  plain_text?: string
}

/**
 * Notionブロック作成リクエストの型定義
 */
export type NotionBlockRequest = {
  type: string
  [key: string]: unknown
}

/**
 * Notionヘッディングブロックの型定義
 */
export type NotionHeadingBlock = {
  type: "heading_1" | "heading_2" | "heading_3"
  heading_1?: {
    rich_text: NotionRichTextItem[]
  }
  heading_2?: {
    rich_text: NotionRichTextItem[]
  }
  heading_3?: {
    rich_text: NotionRichTextItem[]
  }
}

/**
 * Notion段落ブロックの型定義
 */
export type NotionParagraphBlock = {
  type: "paragraph"
  paragraph: {
    rich_text: NotionRichTextItem[]
  }
}

/**
 * Notionコードブロックの型定義
 */
export type NotionCodeBlock = {
  type: "code"
  code: {
    rich_text: NotionRichTextItem[]
    language: string
  }
}

/**
 * Notionリストアイテムブロックの型定義
 */
export type NotionListItemBlock = {
  type: "bulleted_list_item" | "numbered_list_item"
  bulleted_list_item?: {
    rich_text: NotionRichTextItem[]
    children?: NotionBlockRequest[]
  }
  numbered_list_item?: {
    rich_text: NotionRichTextItem[]
    children?: NotionBlockRequest[]
  }
}

/**
 * Notionブロックの全ての型のユニオン
 */
export type NotionBlock =
  | NotionHeadingBlock
  | NotionParagraphBlock
  | NotionCodeBlock
  | NotionListItemBlock
  | NotionBlockRequest

/**
 * Notionユーザーの型定義
 */
export type NotionUser = {
  object: "user"
  id: string
  name?: string
  avatar_url?: string
  type?: "person" | "bot"
  person?: {
    email?: string
  }
  bot?: {
    owner: {
      type: "workspace" | "user"
      workspace?: boolean
      user?: NotionUser
    }
    workspace_name?: string
  }
}

/**
 * Notionページの親情報の型定義
 */
export type NotionParent = {
  type: "page_id" | "database_id" | "workspace"
  page_id?: string
  database_id?: string
  workspace?: boolean
}

/**
 * Notionブロックレスポンスのメタデータ付きの型定義
 */
export type NotionBlockWithMeta = NotionBlockResponse & {
  object: "block"
  id: string
  parent: NotionParent
  created_time: string
  last_edited_time: string
  created_by: NotionUser
  last_edited_by: NotionUser
  has_children: boolean
  archived: boolean
}

/**
 * サンプルデータのベース型
 */
export type SampleData<T> = {
  readonly data: T
  readonly description: string
}

/**
 * マークダウンサンプルの型定義
 */
export type MarkdownSample = SampleData<string>

/**
 * マークダウントークンサンプルの型定義
 */
export type MarkdownTokensSample = SampleData<MarkdownToken[]>

/**
 * Notionブロックサンプルの型定義
 */
export type NotionBlocksSample = SampleData<NotionBlock[]>

/**
 * Notionブロックレスポンスサンプルの型定義
 */
export type NotionBlocksResponseSample = SampleData<NotionBlockWithMeta[]>
