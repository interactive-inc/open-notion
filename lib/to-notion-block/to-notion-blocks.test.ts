import { expect, test } from "bun:test"
import { sampleMarkdown } from "../samples/markdown"
import { sampleNotionBlocks } from "../samples/notion-blocks"
import { toNotionBlocks } from "./to-notion-blocks"

test("toNotionBlocks", () => {
  const blocks = toNotionBlocks(sampleMarkdown.data)

  expect(JSON.stringify(blocks)).toBe(JSON.stringify(sampleNotionBlocks.data))
})

test("段落間の空行が正しく処理される", () => {
  const markdown = `段落1

段落2`

  const blocks = toNotionBlocks(markdown)

  expect(blocks).toHaveLength(2)
  expect(blocks[0]).toEqual({
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "段落1" },
          // @ts-expect-error テストでplain_textプロパティを検証するが実際の型にはない
          plain_text: "段落1",
          annotations: {},
        },
      ],
    },
  })
  expect(blocks[1]).toEqual({
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "段落2" },
          // @ts-expect-error テストでplain_textプロパティを検証するが実際の型にはない
          plain_text: "段落2",
          annotations: {},
        },
      ],
    },
  })
})
