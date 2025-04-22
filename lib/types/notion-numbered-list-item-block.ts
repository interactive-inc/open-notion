import type { NumberedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { NotionBlock } from "./notion-block"

export type NotionNumberedListItemBlock =
  NumberedListItemBlockObjectResponse & {
    children: NotionBlock[]
  }
