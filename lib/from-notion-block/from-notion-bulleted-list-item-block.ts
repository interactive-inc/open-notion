import type { NotionBulletedListItemBlock } from "../types/notion-bulleted-list-item-block"
import { fromNotionRichTextItem } from "../utils/from-notion-rich-text-item"
import { fromNotionBlock } from "./from-notion-block"

export function fromNotionBulletedListItemBlock(
  block: NotionBulletedListItemBlock,
): string {
  const itemText = `- ${fromNotionRichTextItem(block.bulleted_list_item.rich_text)}`

  if (block.children.length === 0) {
    return itemText
  }

  const childrenText = block.children
    .map((childBlock) => {
      const childMarkdown = fromNotionBlock(childBlock)
      return childMarkdown
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n")
    })
    .join("\n")

  return `${itemText}\n${childrenText}`.trim()
}
