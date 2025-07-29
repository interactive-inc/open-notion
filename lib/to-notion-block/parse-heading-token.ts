import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { parseInlineToken } from "@/to-notion-block/parse-inline-token"
import { BlockType } from "@/types"

/**
 * Convert heading token to Notion block
 */
export function parseHeadingToken(
  markedToken: Tokens.Heading,
): BlockObjectRequest {
  if (markedToken.depth === 2) {
    return {
      type: BlockType.Heading2,
      heading_2: {
        rich_text: markedToken.tokens.map(parseInlineToken),
      },
    } as const
  }

  if (markedToken.depth >= 3) {
    return {
      type: BlockType.Heading3,
      heading_3: {
        rich_text: markedToken.tokens.map(parseInlineToken),
      },
    } as const
  }

  return {
    type: BlockType.Heading1,
    heading_1: {
      rich_text: markedToken.tokens.map(parseInlineToken),
    },
  } as const
}
