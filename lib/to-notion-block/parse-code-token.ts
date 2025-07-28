import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { BlockType } from "../types/block-type"
import { parseInlineToken } from "./parse-inline-token"

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
