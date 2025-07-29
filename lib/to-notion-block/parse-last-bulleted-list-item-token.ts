import type { BlockObjectRequestWithoutChildren } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { parseInlineToken } from "@/to-notion-block/parse-inline-token"
import { BlockType } from "@/types"

/**
 * Convert last bulleted list item to Notion block
 */
export function parseLastBulletedListItem(
  item: Tokens.ListItem,
): BlockObjectRequestWithoutChildren {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  return {
    type: BlockType.BulletedListItem,
    bulleted_list_item: {
      rich_text: [parseInlineToken(textToken)],
    },
  }
}
