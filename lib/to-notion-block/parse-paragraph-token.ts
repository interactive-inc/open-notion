import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { parseInlineToken } from "@/to-notion-block/parse-inline-token"
import { BlockType } from "@/types"

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
