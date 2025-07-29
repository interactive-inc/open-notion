import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import type { Tokens } from "marked"
import { parseBulletedListItemToken } from "@/to-notion-block/parse-bulleted-list-item-token"
import { parseNumberedListItemToken } from "@/to-notion-block/parse-numbered-list-item-token"

/**
 * Convert list token to Notion blocks
 */
export function parseListToken(token: Tokens.List): BlockObjectRequest[] {
  return token.items.map((item) => {
    if (token.ordered) {
      return parseNumberedListItemToken(item)
    }

    return parseBulletedListItemToken(item)
  })
}
