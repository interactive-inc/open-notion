import type { NotionBlock } from "../types/notion-block"
import { fromNotionBlock } from "./from-notion-block"

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
