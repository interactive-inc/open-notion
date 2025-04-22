import type { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionRichTextItem } from "../utils/from-notion-rich-text-item"

export function fromNotionParagraphBlock(
  block: ParagraphBlockObjectResponse,
): string {
  return fromNotionRichTextItem(block.paragraph.rich_text).trim()
}
