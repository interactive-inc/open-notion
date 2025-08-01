import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints"
import { lexer, type Tokens } from "marked"
import { parseCodeToken } from "@/to-notion-block/parse-code-token"
import { parseHeadingToken } from "@/to-notion-block/parse-heading-token"
import { parseListToken } from "@/to-notion-block/parse-list-token"
import { parseParagraphToken } from "@/to-notion-block/parse-paragraph-token"

/**
 * Convert markdown string to Notion blocks
 *
 * CRITICAL PARAGRAPH SEPARATION BEHAVIOR:
 * - We deliberately SKIP 'space' tokens to avoid creating unnecessary empty paragraph blocks
 * - Paragraph separation is handled by fromNotionBlocks through proper spacing between blocks
 * - This ensures clean paragraph separation without redundant empty blocks in Notion
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

    // CRITICAL: DO NOT process 'space' tokens here!
    // Space tokens (markdown blank lines) should NOT create empty paragraph blocks.
    // Paragraph spacing is handled in fromNotionBlocks to ensure proper paragraph separation
    // without creating redundant empty blocks that show as unwanted blank lines in Notion.
  }

  return blocks
}
