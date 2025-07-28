import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import { lexer, type Tokens } from "marked"
import { parseCodeToken } from "./parse-code-token"
import { parseHeadingToken } from "./parse-heading-token"
import { parseListToken } from "./parse-list-token"
import { parseParagraphToken } from "./parse-paragraph-token"

/**
 * Convert markdown string to Notion blocks
 */
export function toNotionBlocks(markdown: string): BlockObjectRequest[] {
  const tokenList = lexer(markdown)

  const blocks: BlockObjectRequest[] = []

  for (const token of tokenList) {
    if (token.type === "heading") {
      const t = token as Tokens.Heading
      blocks.push(parseHeadingToken(t))
    }

    if (token.type === "list") {
      const t = token as Tokens.List
      const objects = parseListToken(t)
      for (const node of objects) {
        blocks.push(node)
      }
    }

    if (token.type === "code") {
      const t = token as Tokens.Code
      blocks.push(parseCodeToken(t))
    }

    if (token.type === "paragraph") {
      const t = token as Tokens.Paragraph
      blocks.push(parseParagraphToken(t))
    }
  }

  return blocks
}
