import { expect, test } from "bun:test"
import { toNotionMultiSelectProperty } from "./to-notion-multi-select-property"

test("文字列配列を正しくmulti_selectプロパティに変換", () => {
  const result = toNotionMultiSelectProperty(["選択肢A", "選択肢B"])

  expect(result).toEqual({
    multi_select: [{ name: "選択肢A" }, { name: "選択肢B" }],
  })
})

test("単一の文字列を正しく変換", () => {
  const result = toNotionMultiSelectProperty("選択肢A")

  expect(result).toEqual({
    multi_select: [{ name: "選択肢A" }],
  })
})

test("空配列を正しく変換", () => {
  const result = toNotionMultiSelectProperty([])

  expect(result).toEqual({
    multi_select: [],
  })
})

test("nullを正しく変換", () => {
  const result = toNotionMultiSelectProperty(null)

  expect(result).toEqual({
    multi_select: [],
  })
})

test("数値を渡すとエラーをthrow", () => {
  expect(() => toNotionMultiSelectProperty(123)).toThrow()
})

test("undefinedを渡すとエラーをthrow", () => {
  expect(() => toNotionMultiSelectProperty(undefined)).toThrow()
})

test("オブジェクトを渡すとエラーをthrow", () => {
  expect(() => toNotionMultiSelectProperty({})).toThrow()
})

test("真偽値を渡すとエラーをthrow", () => {
  expect(() => toNotionMultiSelectProperty(true)).toThrow()
})

test("数値配列を渡すとエラーをthrow", () => {
  expect(() => toNotionMultiSelectProperty([1, 2, 3])).toThrow()
})
