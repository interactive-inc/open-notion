import type { BlockObjectRequestWithoutChildren } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { BlockType } from "../types/block-type"
import { parseInlineToken } from "./parse-inline-token"

/**
 * Convert last numbered list item to Notion block
 */
export function parseLastNumberedListItem(
  item: Tokens.ListItem,
): BlockObjectRequestWithoutChildren {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  return {
    type: BlockType.NumberedListItem,
    numbered_list_item: {
      rich_text: [parseInlineToken(textToken)],
    },
  }
}
