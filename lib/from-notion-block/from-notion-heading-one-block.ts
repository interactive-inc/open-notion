import type { Heading1BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionRichTextItem } from "@/utils/from-notion-rich-text-item"

export function fromNotionHeadingOneBlock(
  block: Heading1BlockObjectResponse,
): string {
  return `# ${fromNotionRichTextItem(block.heading_1.rich_text)}`.trim()
}
