import type { Heading2BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionRichTextItem } from "@/utils/from-notion-rich-text-item"

export function fromNotionHeadingTwoBlock(
  block: Heading2BlockObjectResponse,
): string {
  return `## ${fromNotionRichTextItem(block.heading_2.rich_text)}`.trim()
}
