import { expect, test } from "bun:test"
import { toNotionRichTextProperty } from "./to-notion-rich-text-property"

test("文字列を正しくrich_textプロパティに変換", () => {
  const result = toNotionRichTextProperty("リッチテキスト")

  expect(result).toEqual({
    rich_text: [
      {
        type: "text",
        text: {
          content: "リッチテキスト",
        },
      },
    ],
  })
})

test("空文字列を正しく変換", () => {
  const result = toNotionRichTextProperty("")

  expect(result).toEqual({
    rich_text: [
      {
        type: "text",
        text: {
          content: "",
        },
      },
    ],
  })
})

test("数値を渡すとエラーをthrow", () => {
  expect(() => toNotionRichTextProperty(123)).toThrow()
})

test("nullを渡すとエラーをthrow", () => {
  expect(() => toNotionRichTextProperty(null)).toThrow()
})

test("undefinedを渡すとエラーをthrow", () => {
  expect(() => toNotionRichTextProperty(undefined)).toThrow()
})

test("オブジェクトを渡すとエラーをthrow", () => {
  expect(() => toNotionRichTextProperty({})).toThrow()
})

test("配列を渡すとエラーをthrow", () => {
  expect(() => toNotionRichTextProperty([])).toThrow()
})
