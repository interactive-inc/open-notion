import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"

/**
 * Notionブロックの型定義
 */
export type NotionBlock = BlockObjectResponse & {
  children: NotionBlock[]
}
