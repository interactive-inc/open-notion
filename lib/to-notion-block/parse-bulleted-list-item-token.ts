import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { BlockType } from "../types/block-type"
import { parseInlineToken } from "./parse-inline-token"
import { parseNestedBulletedListItemToken } from "./parse-nested-bulleted-list-item-token"
import { parseNestedNumberedListItemToken } from "./parse-nested-numbered-list-item-token"

/**
 * Convert bulleted list item token to Notion block
 */
export function parseBulletedListItemToken(
  item: Tokens.ListItem,
): BlockObjectRequest {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  const itemListToken = item.tokens.find((t) => {
    return t.type === "list"
  })

  const listToken = itemListToken as Tokens.List

  const children = listToken?.items.map((item) => {
    return listToken.ordered
      ? parseNestedNumberedListItemToken(item)
      : parseNestedBulletedListItemToken(item)
  })

  return {
    type: BlockType.BulletedListItem,
    bulleted_list_item: {
      rich_text: [parseInlineToken(textToken)],
      children: children as never,
    },
  }
}
