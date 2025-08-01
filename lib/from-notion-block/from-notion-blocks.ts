import { fromNotionBlock } from "@/from-notion-block/from-notion-block"
import type { NotionBlock } from "@/types"

/**
 * Notionブロックの配列をマークダウンテキストに変換する
 */
export function fromNotionBlocks(blocks: NotionBlock[]): string {
  let result = ""

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (!block) continue

    const blockContent = fromNotionBlock(block)

    if (blockContent.trim() !== "") {
      result += blockContent

      // 次のブロックがある場合の改行処理
      if (i < blocks.length - 1) {
        const currentBlockType = block.type
        const nextBlock = blocks[i + 1]
        const nextBlockType = nextBlock?.type

        // リストアイテム同士は単一改行
        if (
          (currentBlockType === "bulleted_list_item" ||
            currentBlockType === "numbered_list_item") &&
          (nextBlockType === "bulleted_list_item" ||
            nextBlockType === "numbered_list_item")
        ) {
          result += "\n"
        } else {
          // その他は改行のみ（空行なし）
          result += "\n"
        }
      }
    }
  }

  return result.trim()
}
