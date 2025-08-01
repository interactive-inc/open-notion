import { expect, test } from "bun:test"
import type { Schema } from "@/types"
import { NotionPropertyConverterLegacy } from "./notion-property-converter-legacy"

const converter = new NotionPropertyConverterLegacy()

test("fromNotion: タイトルプロパティの変換", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const properties = {
    title: {
      title: [{ plain_text: "テストタイトル" }],
    },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.title).toBe("テストタイトル")

  // 空の場合
  const emptyResult = converter.fromNotion(schema, { title: { title: [] } })
  expect(emptyResult.title).toBe("")
})

test("fromNotion: リッチテキストプロパティの変換", () => {
  const schema: Schema = {
    content: { type: "rich_text" },
  }

  const properties = {
    content: {
      rich_text: [
        { plain_text: "これは" },
        { plain_text: "リッチテキスト" },
        { plain_text: "です" },
      ],
    },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.content).toBe("これはリッチテキストです")
})

test("fromNotion: 数値プロパティの変換", () => {
  const schema: Schema = {
    score: { type: "number" },
  }

  const properties = {
    score: { number: 42 },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.score).toBe(42)

  // nullの場合
  const nullResult = converter.fromNotion(schema, { score: { number: null } })
  expect(nullResult.score).toBeNull()
})

test("fromNotion: 選択プロパティの変換", () => {
  const schema: Schema = {
    status: { type: "select", options: ["todo", "done"] },
  }

  const properties = {
    status: { select: { name: "todo" } },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.status).toBe("todo")

  // nullの場合
  const nullResult = converter.fromNotion(schema, { status: { select: null } })
  expect(nullResult.status).toBeNull()
})

test("fromNotion: 複数選択プロパティの変換", () => {
  const schema: Schema = {
    tags: { type: "multi_select", options: ["js", "ts", "react"] },
  }

  const properties = {
    tags: {
      multi_select: [{ name: "js" }, { name: "react" }],
    },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.tags).toEqual(["js", "react"])

  // 空の場合
  const emptyResult = converter.fromNotion(schema, {
    tags: { multi_select: [] },
  })
  expect(emptyResult.tags).toEqual([])
})

test("fromNotion: 日付プロパティの変換", () => {
  const schema: Schema = {
    deadline: { type: "date" },
  }

  const properties = {
    deadline: {
      date: {
        start: "2024-01-01",
        end: "2024-01-31",
      },
    },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.deadline).toEqual({
    start: "2024-01-01",
    end: "2024-01-31",
  })

  // 終了日なし
  const singleDate = converter.fromNotion(schema, {
    deadline: { date: { start: "2024-01-01", end: null } },
  })
  expect(singleDate.deadline).toEqual({
    start: "2024-01-01",
    end: null,
  })
})

test("fromNotion: チェックボックスプロパティの変換", () => {
  const schema: Schema = {
    completed: { type: "checkbox" },
  }

  const properties = {
    completed: { checkbox: true },
  }

  const result = converter.fromNotion(schema, properties)
  expect(result.completed).toBe(true)

  // falseの場合
  const falseResult = converter.fromNotion(schema, {
    completed: { checkbox: false },
  })
  expect(falseResult.completed).toBe(false)
})

test("fromNotion: 必須プロパティのエラー", () => {
  const schema: Schema = {
    title: { type: "title", required: true },
  }

  expect(() => {
    converter.fromNotion(schema, {})
  }).toThrow("必須プロパティ title が見つかりません")
})

test("toNotion: タイトルプロパティの変換", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const data = { title: "テストタイトル" }
  const result = converter.toNotion(schema, data)

  expect(result.title).toEqual({
    title: [{ type: "text", text: { content: "テストタイトル" } }],
  })
})

test("toNotion: リッチテキストプロパティの変換", () => {
  const schema: Schema = {
    content: { type: "rich_text" },
  }

  const data = { content: "リッチテキスト内容" }
  const result = converter.toNotion(schema, data)

  expect(result.content).toEqual({
    rich_text: [{ type: "text", text: { content: "リッチテキスト内容" } }],
  })
})

test("toNotion: 数値プロパティの変換", () => {
  const schema: Schema = {
    score: { type: "number" },
  }

  const data = { score: 100 }
  const result = converter.toNotion(schema, data)

  expect(result.score).toEqual({ number: 100 })

  // 数値以外の場合
  const nullResult = converter.toNotion(schema, { score: null })
  expect(nullResult.score).toEqual({ number: null })
})

test("toNotion: 選択プロパティの変換", () => {
  const schema: Schema = {
    status: { type: "select", options: ["todo", "done"] },
  }

  const data = { status: "todo" }
  const result = converter.toNotion(schema, data)

  expect(result.status).toEqual({ select: { name: "todo" } })

  // 空文字の場合
  const emptyResult = converter.toNotion(schema, { status: "" })
  expect(emptyResult.status).toEqual({ select: null })
})

test("toNotion: 複数選択プロパティの変換", () => {
  const schema: Schema = {
    tags: { type: "multi_select", options: ["js", "ts"] },
  }

  const data = { tags: ["js", "ts"] }
  const result = converter.toNotion(schema, data)

  expect(result.tags).toEqual({
    multi_select: [{ name: "js" }, { name: "ts" }],
  })

  // 配列以外の場合
  const emptyResult = converter.toNotion(schema, { tags: null })
  expect(emptyResult.tags).toEqual({ multi_select: [] })
})

test("toNotion: 日付プロパティの変換", () => {
  const schema: Schema = {
    deadline: { type: "date" },
  }

  // DateRange型
  const dateRangeData = {
    deadline: { start: "2024-01-01", end: "2024-01-31" },
  }
  const dateRangeResult = converter.toNotion(schema, dateRangeData)
  expect(dateRangeResult.deadline).toEqual({
    date: { start: "2024-01-01", end: "2024-01-31" },
  })

  // Date型（後方互換）
  const date = new Date("2024-01-01")
  const dateResult = converter.toNotion(schema, {
    deadline: { start: date.toISOString(), end: null },
  })
  expect(dateResult.deadline).toEqual({
    date: { start: date.toISOString(), end: null },
  })

  // null
  const nullResult = converter.toNotion(schema, { deadline: null })
  expect(nullResult.deadline).toEqual({ date: null })
})

test("toNotion: チェックボックスプロパティの変換", () => {
  const schema: Schema = {
    completed: { type: "checkbox" },
  }

  const data = { completed: true }
  const result = converter.toNotion(schema, data)

  expect(result.completed).toEqual({ checkbox: true })

  // falsy値
  const falsyResult = converter.toNotion(schema, { completed: false })
  expect(falsyResult.completed).toEqual({ checkbox: false })
})

test("toNotion: URLプロパティの変換", () => {
  const schema: Schema = {
    website: { type: "url" },
  }

  const data = { website: "https://example.com" }
  const result = converter.toNotion(schema, data)

  expect(result.website).toEqual({ url: "https://example.com" })

  // 空の場合
  const emptyResult = converter.toNotion(schema, { website: null })
  expect(emptyResult.website).toEqual({ url: "" })
})

test("toNotion: リレーションプロパティの変換", () => {
  const schema: Schema = {
    related: { type: "relation", database_id: "db-id" },
  }

  // 配列
  const arrayData = { related: ["page-1", "page-2"] }
  const arrayResult = converter.toNotion(schema, arrayData)
  expect(arrayResult.related).toEqual({
    relation: [{ id: "page-1" }, { id: "page-2" }],
  })

  // 単一文字列
  const stringData = { related: ["page-1"] }
  const stringResult = converter.toNotion(schema, stringData)
  expect(stringResult.related).toEqual({
    relation: [{ id: "page-1" }],
  })

  // 空配列
  const emptyResult = converter.toNotion(schema, { related: [] })
  expect(emptyResult.related).toEqual({ relation: [] })
})

test("toNotion: undefinedプロパティはスキップ", () => {
  const schema: Schema = {
    title: { type: "title" },
    description: { type: "rich_text" },
  }

  const data = { title: "タイトル", description: undefined }
  const result = converter.toNotion(schema, data)

  expect(result).toEqual({
    title: { title: [{ type: "text", text: { content: "タイトル" } }] },
  })
  expect(result.description).toBeUndefined()
})

test("toNotion: スキーマに存在しないプロパティはスキップ", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const data = { title: "タイトル", unknown: "不明なプロパティ" }
  const result = converter.toNotion(schema, data)

  expect(result).toEqual({
    title: { title: [{ type: "text", text: { content: "タイトル" } }] },
  })
  expect(result.unknown).toBeUndefined()
})
