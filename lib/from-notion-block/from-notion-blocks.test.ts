import { expect, test } from "bun:test"
import {
  sampleNotionBlocksResponse,
  sampleNotionBlocksResponseMarkdown,
} from "../samples/notion-blocks-response"
import { fromNotionBlocks } from "./from-notion-blocks"

test("fromNotionBlocks", () => {
  // 型キャストしてNotionBlock[]として扱う（childrenプロパティは空配列で初期化）
  const blocksWithChildren = sampleNotionBlocksResponse.data.map((block) => ({
    ...block,
    children: [],
  }))

  const text = fromNotionBlocks(blocksWithChildren)

  expect(text).toBe(sampleNotionBlocksResponseMarkdown)
})
