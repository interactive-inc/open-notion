import { expect, test } from "bun:test"
import type { NotionBlock } from "@/types"
import { fromNotionBlock } from "./from-notion-block"

test("段落ブロックを変換できる", () => {
  const block = {
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "これは段落です。", link: null },
          plain_text: "これは段落です。",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      color: "default",
    },
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("これは段落です。")
})

test("見出し1ブロックを変換できる", () => {
  const block = {
    type: "heading_1",
    heading_1: {
      rich_text: [
        {
          type: "text",
          text: { content: "大見出し", link: null },
          plain_text: "大見出し",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      is_toggleable: false,
      color: "default",
    },
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("# 大見出し")
})

test("見出し2ブロックを変換できる", () => {
  const block = {
    type: "heading_2",
    heading_2: {
      rich_text: [
        {
          type: "text",
          text: { content: "中見出し", link: null },
          plain_text: "中見出し",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      is_toggleable: false,
      color: "default",
    },
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("## 中見出し")
})

test("見出し3ブロックを変換できる", () => {
  const block = {
    type: "heading_3",
    heading_3: {
      rich_text: [
        {
          type: "text",
          text: { content: "小見出し", link: null },
          plain_text: "小見出し",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      is_toggleable: false,
      color: "default",
    },
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("### 小見出し")
})

test("箇条書きリストアイテムを変換できる", () => {
  const block = {
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "リストアイテム", link: null },
          plain_text: "リストアイテム",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      color: "default",
    },
    children: [],
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("- リストアイテム")
})

test("番号付きリストアイテムを変換できる", () => {
  const block = {
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "番号付きアイテム", link: null },
          plain_text: "番号付きアイテム",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      color: "default",
    },
    children: [],
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("1. 番号付きアイテム")
})

test("コードブロックを変換できる", () => {
  const block = {
    type: "code",
    code: {
      rich_text: [
        {
          type: "text",
          text: { content: "console.log('Hello, World!');", link: null },
          plain_text: "console.log('Hello, World!');",
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
        },
      ],
      language: "javascript",
      caption: [],
    },
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("```javascript\nconsole.log('Hello, World!');\n```")
})

test("未対応のブロックタイプの場合", () => {
  const block = {
    type: "unsupported_block_type",
  } as unknown as NotionBlock

  const result = fromNotionBlock(block)
  expect(result).toBe("<!-- 未対応のブロックタイプ: unsupported_block_type -->")
})
