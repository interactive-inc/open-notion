import { expect, test } from "bun:test"
import { toNotionTitleProperty } from "./to-notion-title-property"

test("文字列を正しくtitleプロパティに変換", () => {
  const result = toNotionTitleProperty("テストタイトル")

  expect(result).toEqual({
    title: [
      {
        type: "text",
        text: {
          content: "テストタイトル",
        },
      },
    ],
  })
})

test("空文字列を正しく変換", () => {
  const result = toNotionTitleProperty("")

  expect(result).toEqual({
    title: [
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
  expect(() => toNotionTitleProperty(123)).toThrow()
})

test("nullを渡すとエラーをthrow", () => {
  expect(() => toNotionTitleProperty(null)).toThrow()
})

test("undefinedを渡すとエラーをthrow", () => {
  expect(() => toNotionTitleProperty(undefined)).toThrow()
})

test("オブジェクトを渡すとエラーをthrow", () => {
  expect(() => toNotionTitleProperty({})).toThrow()
})

test("配列を渡すとエラーをthrow", () => {
  expect(() => toNotionTitleProperty([])).toThrow()
})
