import { fromNotionParagraphBlock } from "./from-notion-paragraph-block"
import { fromNotionHeading1Block } from "./from-notion-heading1-block"
import { fromNotionHeading2Block } from "./from-notion-heading2-block"
import { fromNotionHeading3Block } from "./from-notion-heading3-block"
import { fromNotionBulletedListItemBlock } from "./from-notion-bulleted-list-item-block"
import { fromNotionNumberedListItemBlock } from "./from-notion-numbered-list-item-block"
import { fromNotionCodeBlock } from "./from-notion-code-block"
import type { NotionBlock } from "../types/notion-block"

/**
 * 単一のNotionブロックをマークダウンテキストに変換する
 */
export function fromNotionBlock(block: NotionBlock): string {
  if (block.type === "paragraph") {
    return fromNotionParagraphBlock(block)
  }

  if (block.type === "heading_1") {
    return fromNotionHeading1Block(block)
  }

  if (block.type === "heading_2") {
    return fromNotionHeading2Block(block)
  }

  if (block.type === "heading_3") {
    return fromNotionHeading3Block(block)
  }

  if (block.type === "bulleted_list_item") {
    return fromNotionBulletedListItemBlock(block)
  }

  if (block.type === "numbered_list_item") {
    return fromNotionNumberedListItemBlock(block)
  }

  if (block.type === "code") {
    return fromNotionCodeBlock(block)
  }

  return `<!-- 未対応のブロックタイプ: ${block.type} -->`
}
