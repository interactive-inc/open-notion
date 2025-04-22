import { expect, test } from "bun:test"
import { toNotionBlocks } from "./to-notion-blocks"

test("toNotionBlocks", async () => {
  const mdText = await Bun.file("samples/markdown.md").text()

  const jsonText = await Bun.file("samples/notion-blocks.json").text()

  const blocks = toNotionBlocks(mdText)

  expect(JSON.stringify(blocks)).toBe(JSON.stringify(JSON.parse(jsonText)))
})
