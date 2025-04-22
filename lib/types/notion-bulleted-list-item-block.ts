import type { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { NotionBlock } from "./notion-block"

export type NotionBulletedListItemBlock =
  BulletedListItemBlockObjectResponse & {
    children: NotionBlock[]
  }
