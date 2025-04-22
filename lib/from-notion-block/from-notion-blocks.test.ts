import { expect, test } from "bun:test"
import { fromNotionBlocks } from "./from-notion-blocks"

test("fromNotionBlocks", async () => {
  const jsonText = await Bun.file("samples/notion-blocks-response.json").text()

  const text = fromNotionBlocks(JSON.parse(jsonText))

  const mdText = await Bun.file("samples/markdown.md").text()

  expect(text).toBe(mdText.trim())
})
