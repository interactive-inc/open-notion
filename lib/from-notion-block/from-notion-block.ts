import { fromNotionBulletedListItemBlock } from "@/from-notion-block/from-notion-bulleted-list-item-block"
import { fromNotionCodeBlock } from "@/from-notion-block/from-notion-code-block"
import { fromNotionHeadingOneBlock } from "@/from-notion-block/from-notion-heading-one-block"
import { fromNotionHeadingThreeBlock } from "@/from-notion-block/from-notion-heading-three-block"
import { fromNotionHeadingTwoBlock } from "@/from-notion-block/from-notion-heading-two-block"
import { fromNotionNumberedListItemBlock } from "@/from-notion-block/from-notion-numbered-list-item-block"
import { fromNotionParagraphBlock } from "@/from-notion-block/from-notion-paragraph-block"
import type { NotionBlock } from "@/types"

/**
 * 単一のNotionブロックをマークダウンテキストに変換する
 */
export function fromNotionBlock(block: NotionBlock): string {
  if (block.type === "paragraph") {
    return fromNotionParagraphBlock(block)
  }

  if (block.type === "heading_1") {
    return fromNotionHeadingOneBlock(block)
  }

  if (block.type === "heading_2") {
    return fromNotionHeadingTwoBlock(block)
  }

  if (block.type === "heading_3") {
    return fromNotionHeadingThreeBlock(block)
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
