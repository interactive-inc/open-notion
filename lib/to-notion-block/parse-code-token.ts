import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { parseInlineToken } from "@/to-notion-block/parse-inline-token"
import { BlockType } from "@/types"

/**
 * Convert code token to Notion block
 */
export function parseCodeToken(token: Tokens.Code): BlockObjectRequest {
  return {
    type: BlockType.Code,
    code: {
      rich_text: [parseInlineToken(token)],
      language: "plain text" as const,
    },
  } as const
}
