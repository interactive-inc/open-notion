import { fromNotionBlock } from "@/from-notion-block/from-notion-block"
import type { NotionBlock } from "@/types"

/**
 * Notionブロックの配列をマークダウンテキストに変換する
 */
export function fromNotionBlocks(blocks: NotionBlock[]): string {
  let result = ""

  for (const block of blocks) {
    result += fromNotionBlock(block)
    // 各ブロック間に空行を挿入
    result += "\n"
  }

  return result.trim()
}
