import { expect, test } from "bun:test"
import { toNotionSelectProperty } from "./to-notion-select-property"

test("文字列を正しくselectプロパティに変換", () => {
  const result = toNotionSelectProperty("選択肢A")

  expect(result).toEqual({
    select: {
      name: "選択肢A",
    },
  })
})

test("空文字列を正しく変換", () => {
  const result = toNotionSelectProperty("")

  expect(result).toEqual({
    select: null,
  })
})

test("nullを正しく変換", () => {
  const result = toNotionSelectProperty(null)

  expect(result).toEqual({
    select: null,
  })
})

test("数値を渡すとエラーをthrow", () => {
  expect(() => toNotionSelectProperty(123)).toThrow()
})

test("undefinedを渡すとエラーをthrow", () => {
  expect(() => toNotionSelectProperty(undefined)).toThrow()
})

test("オブジェクトを渡すとエラーをthrow", () => {
  expect(() => toNotionSelectProperty({})).toThrow()
})

test("配列を渡すとエラーをthrow", () => {
  expect(() => toNotionSelectProperty([])).toThrow()
})

test("真偽値を渡すとエラーをthrow", () => {
  expect(() => toNotionSelectProperty(true)).toThrow()
})
