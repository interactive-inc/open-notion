import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { BlockType } from "../types/block-type"
import { parseInlineToken } from "./parse-inline-token"

/**
 * Convert paragraph token to Notion block
 */
export function parseParagraphToken(
  token: Tokens.Paragraph,
): BlockObjectRequest {
  return {
    type: BlockType.Paragraph,
    paragraph: {
      rich_text: token.tokens.map(parseInlineToken),
    },
  } as const
}
