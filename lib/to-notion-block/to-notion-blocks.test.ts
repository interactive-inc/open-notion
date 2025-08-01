import { expect, test } from "bun:test"
import { sampleMarkdown } from "../samples/markdown"
import { sampleNotionBlocks } from "../samples/notion-blocks"
import { toNotionBlocks } from "./to-notion-blocks"

test("toNotionBlocks", () => {
  const blocks = toNotionBlocks(sampleMarkdown.data)

  expect(JSON.stringify(blocks)).toBe(JSON.stringify(sampleNotionBlocks.data))
})
