import { expect, test } from "bun:test"
import type { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionParagraphBlock } from "./from-notion-paragraph-block"

const block = {
  object: "block",
  id: "1d8842f9-6181-80d8-af1c-dece63b450b0",
  parent: {
    type: "page_id",
    page_id: "1d8842f9-6181-8042-8c77-d5c2f6cb333b",
  },
  created_time: "2025-04-17T16:09:00.000Z",
  last_edited_time: "2025-04-20T16:01:00.000Z",
  created_by: {
    object: "user",
    id: "63fd3a0c-d05f-48d4-8009-0a0e997edfca",
  },
  last_edited_by: {
    object: "user",
    id: "63fd3a0c-d05f-48d4-8009-0a0e997edfca",
  },
  has_children: false,
  archived: false,
  in_trash: false,
  type: "paragraph",
  paragraph: {
    rich_text: [
      {
        type: "text",
        text: {
          content:
            "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。",
          link: null,
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: "default",
        },
        plain_text:
          "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。",
        href: null,
      },
    ],
    color: "default",
  },
} as const satisfies ParagraphBlockObjectResponse

test("通常の段落ブロックをマークダウンに変換できる", () => {
  const result = fromNotionParagraphBlock(block)

  expect(result).toBe(
    "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。",
  )
})

test("複数のリッチテキスト要素を含む段落ブロックを変換できる", () => {
  const result = fromNotionParagraphBlock(block)

  expect(result).toContain("あの")
  expect(result).toContain("イーハトーヴォ")
  expect(result).toContain("モリーオ")
  expect(result).toContain("のすきとおった風")
})
