import { expect, test } from "bun:test"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionProperty } from "./from-notion-property"

test("titleプロパティを変換", () => {
  const property = {
    type: "title",
    title: [
      {
        type: "text",
        text: { content: "タイトル" },
        plain_text: "タイトル",
        annotations: {},
      },
    ],
  } as Extract<PageObjectResponse["properties"][string], { type: "title" }>

  const result = fromNotionProperty(property)
  expect(result).toBe("タイトル")
})

test("rich_textプロパティを変換", () => {
  const property = {
    type: "rich_text",
    rich_text: [
      {
        type: "text",
        text: { content: "テキスト" },
        plain_text: "テキスト",
        annotations: {},
      },
    ],
  } as Extract<PageObjectResponse["properties"][string], { type: "rich_text" }>

  const result = fromNotionProperty(property)
  expect(result).toBe("テキスト")
})

test("numberプロパティを変換", () => {
  const property = {
    type: "number",
    number: 123.45,
  } as Extract<PageObjectResponse["properties"][string], { type: "number" }>

  const result = fromNotionProperty(property)
  expect(result).toBe(123.45)
})

test("checkboxプロパティを変換", () => {
  const property = {
    type: "checkbox",
    checkbox: true,
  } as Extract<PageObjectResponse["properties"][string], { type: "checkbox" }>

  const result = fromNotionProperty(property)
  expect(result).toBe(true)
})

test("selectプロパティを変換", () => {
  const property = {
    type: "select",
    select: {
      id: "1",
      name: "選択肢A",
      color: "blue",
    },
  } as Extract<PageObjectResponse["properties"][string], { type: "select" }>

  const result = fromNotionProperty(property)
  expect(result).toBe("選択肢A")
})

test("multi_selectプロパティを変換", () => {
  const property = {
    type: "multi_select",
    multi_select: [
      { id: "1", name: "タグ1", color: "blue" },
      { id: "2", name: "タグ2", color: "red" },
    ],
  } as Extract<
    PageObjectResponse["properties"][string],
    { type: "multi_select" }
  >

  const result = fromNotionProperty(property)
  expect(result).toEqual(["タグ1", "タグ2"])
})

test("dateプロパティを変換", () => {
  const property = {
    type: "date",
    date: {
      start: "2023-01-01",
      end: "2023-01-02",
      time_zone: null,
    },
  } as Extract<PageObjectResponse["properties"][string], { type: "date" }>

  const result = fromNotionProperty(property)
  expect(result).toEqual({
    start: "2023-01-01",
    end: "2023-01-02",
  })
})

test("emailプロパティを変換", () => {
  const property = {
    type: "email",
    email: "test@example.com",
  } as Extract<PageObjectResponse["properties"][string], { type: "email" }>

  const result = fromNotionProperty(property)
  expect(result).toBe("test@example.com")
})

test("phone_numberプロパティを変換", () => {
  const property = {
    type: "phone_number",
    phone_number: "090-1234-5678",
  } as Extract<
    PageObjectResponse["properties"][string],
    { type: "phone_number" }
  >

  const result = fromNotionProperty(property)
  expect(result).toBe("090-1234-5678")
})

test("urlプロパティを変換", () => {
  const property = {
    type: "url",
    url: "https://example.com",
  } as Extract<PageObjectResponse["properties"][string], { type: "url" }>

  const result = fromNotionProperty(property)
  expect(result).toBe("https://example.com")
})

test("created_timeプロパティを変換", () => {
  const property = {
    type: "created_time",
    created_time: "2023-01-01T00:00:00.000Z",
  } as Extract<
    PageObjectResponse["properties"][string],
    { type: "created_time" }
  >

  const result = fromNotionProperty(property)
  expect(result).toBe("2023-01-01T00:00:00.000Z")
})

test("last_edited_timeプロパティを変換", () => {
  const property = {
    type: "last_edited_time",
    last_edited_time: "2023-01-01T00:00:00.000Z",
  } as Extract<
    PageObjectResponse["properties"][string],
    { type: "last_edited_time" }
  >

  const result = fromNotionProperty(property)
  expect(result).toBe("2023-01-01T00:00:00.000Z")
})

test("statusプロパティを変換", () => {
  const property = {
    type: "status",
    status: {
      id: "1",
      name: "進行中",
      color: "blue",
    },
  } as Extract<PageObjectResponse["properties"][string], { type: "status" }>

  const result = fromNotionProperty(property)
  expect(result).toBe("進行中")
})

test("statusプロパティがnullの場合", () => {
  const property = {
    type: "status",
    status: null,
  } as Extract<PageObjectResponse["properties"][string], { type: "status" }>

  const result = fromNotionProperty(property)
  expect(result).toBe(null)
})

test("未対応のプロパティタイプはnullを返す", () => {
  const property = {
    type: "unknown_type",
  } as unknown as Extract<
    PageObjectResponse["properties"][string],
    { type: string }
  >

  const result = fromNotionProperty(property)
  expect(result).toBe(null)
})
