import { expect, test } from "bun:test"
import { toNotionNumberProperty } from "./to-notion-number-property"

test("数値を正しくnumberプロパティに変換", () => {
  const result = toNotionNumberProperty(123)

  expect(result).toEqual({
    number: 123,
  })
})

test("小数点を正しく変換", () => {
  const result = toNotionNumberProperty(123.45)

  expect(result).toEqual({
    number: 123.45,
  })
})

test("負の数値を正しく変換", () => {
  const result = toNotionNumberProperty(-456)

  expect(result).toEqual({
    number: -456,
  })
})

test("nullを正しく変換", () => {
  const result = toNotionNumberProperty(null)

  expect(result).toEqual({
    number: null,
  })
})

test("文字列を渡すとエラーをthrow", () => {
  expect(() => toNotionNumberProperty("123")).toThrow()
})

test("undefinedを渡すとエラーをthrow", () => {
  expect(() => toNotionNumberProperty(undefined)).toThrow()
})

test("オブジェクトを渡すとエラーをthrow", () => {
  expect(() => toNotionNumberProperty({})).toThrow()
})

test("配列を渡すとエラーをthrow", () => {
  expect(() => toNotionNumberProperty([])).toThrow()
})
