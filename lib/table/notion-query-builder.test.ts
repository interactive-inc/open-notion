import { expect, test } from "bun:test"
import { NotionQueryBuilder } from "./notion-query-builder"
import type { Schema } from "./types"

const queryBuilder = new NotionQueryBuilder()

test("buildFilter: 単純な条件", () => {
  const schema: Schema = {
    title: { type: "title" },
    status: { type: "select", options: ["todo", "done"] },
    priority: { type: "number" },
  }

  // タイトルの部分一致
  const titleFilter = queryBuilder.buildFilter(schema, {
    title: "検索語",
  })
  expect(titleFilter).toEqual({
    property: "title",
    title: { contains: "検索語" },
  })

  // 選択肢の完全一致
  const selectFilter = queryBuilder.buildFilter(schema, {
    status: "todo",
  })
  expect(selectFilter).toEqual({
    property: "status",
    select: { equals: "todo" },
  })

  // 数値の完全一致
  const numberFilter = queryBuilder.buildFilter(schema, {
    priority: 5,
  })
  expect(numberFilter).toEqual({
    property: "priority",
    number: { equals: 5 },
  })
})

test("buildFilter: 複数条件（AND）", () => {
  const schema: Schema = {
    title: { type: "title" },
    status: { type: "select", options: ["todo", "done"] },
  }

  const filter = queryBuilder.buildFilter(schema, {
    title: "タスク",
    status: "todo",
  })

  expect(filter).toEqual({
    and: [
      { property: "title", title: { contains: "タスク" } },
      { property: "status", select: { equals: "todo" } },
    ],
  })
})

test("buildFilter: $or条件", () => {
  const schema = {
    status: { type: "select", options: ["todo", "in_progress", "done"] },
    priority: { type: "number" },
  } as const

  const filter = queryBuilder.buildFilter(schema, {
    $or: [{ status: "todo" }, { priority: 5 }],
  })

  expect(filter).toEqual({
    or: [
      { property: "status", select: { equals: "todo" } },
      { property: "priority", number: { equals: 5 } },
    ],
  })
})

test("buildFilter: $and条件", () => {
  const schema = {
    status: { type: "select", options: ["todo", "done"] },
    priority: { type: "number" },
  } as const

  const filter = queryBuilder.buildFilter(schema, {
    $and: [{ status: "todo" }, { priority: 5 }],
  })

  expect(filter).toEqual({
    and: [
      { property: "status", select: { equals: "todo" } },
      { property: "priority", number: { equals: 5 } },
    ],
  })
})

test("buildFilter: 演算子条件", () => {
  const schema: Schema = {
    priority: { type: "number" },
    deadline: { type: "date" },
  }

  // 数値の比較演算子
  const gtFilter = queryBuilder.buildFilter(schema, {
    priority: { $gt: 3 },
  })
  expect(gtFilter).toEqual({
    property: "priority",
    number: { greater_than: 3 },
  })

  const gteFilter = queryBuilder.buildFilter(schema, {
    priority: { $gte: 3 },
  })
  expect(gteFilter).toEqual({
    property: "priority",
    number: { greater_than_or_equal_to: 3 },
  })

  const ltFilter = queryBuilder.buildFilter(schema, {
    priority: { $lt: 5 },
  })
  expect(ltFilter).toEqual({
    property: "priority",
    number: { less_than: 5 },
  })

  const lteFilter = queryBuilder.buildFilter(schema, {
    priority: { $lte: 5 },
  })
  expect(lteFilter).toEqual({
    property: "priority",
    number: { less_than_or_equal_to: 5 },
  })

  // 日付の比較演算子
  const dateAfterFilter = queryBuilder.buildFilter(schema, {
    deadline: { $gt: { start: "2024-01-01", end: null } },
  })
  expect(dateAfterFilter).toEqual({
    property: "deadline",
    date: { after: "2024-01-01" },
  })
})

test("buildFilter: $contains演算子", () => {
  const schema: Schema = {
    title: { type: "title" },
    description: { type: "rich_text" },
    tags: { type: "multi_select", options: ["js", "ts", "react"] },
  }

  // タイトルの部分一致
  const titleContains = queryBuilder.buildFilter(schema, {
    title: { $contains: "検索" },
  })
  expect(titleContains).toEqual({
    property: "title",
    title: { contains: "検索" },
  })

  // リッチテキストの部分一致
  const richTextContains = queryBuilder.buildFilter(schema, {
    description: { $contains: "説明" },
  })
  expect(richTextContains).toEqual({
    property: "description",
    rich_text: { contains: "説明" },
  })

  // 複数選択の包含
  const multiSelectContains = queryBuilder.buildFilter(schema, {
    tags: ["js"],
  })
  expect(multiSelectContains).toEqual({
    property: "tags",
    multi_select: { contains: "js" },
  })
})

test("buildFilter: $in演算子", () => {
  const schema: Schema = {
    status: { type: "select", options: ["todo", "in_progress", "done"] },
  }

  const filter = queryBuilder.buildFilter(schema, {
    status: { $in: ["todo", "in_progress"] },
  })

  expect(filter).toEqual({
    or: [
      { property: "status", select: { equals: "todo" } },
      { property: "status", select: { equals: "in_progress" } },
    ],
  })

  // 単一値の場合
  const singleFilter = queryBuilder.buildFilter(schema, {
    status: { $in: ["todo"] },
  })
  expect(singleFilter).toEqual({
    property: "status",
    select: { equals: "todo" },
  })
})

test("buildFilter: $ne演算子", () => {
  const schema: Schema = {
    status: { type: "select", options: ["todo", "done"] },
  }

  const filter = queryBuilder.buildFilter(schema, {
    status: { $ne: "done" },
  })

  expect(filter).toEqual({
    property: "status",
    select: { does_not_equal: "done" },
  })
})

test("buildFilter: 複雑な条件の組み合わせ", () => {
  const schema = {
    title: { type: "title" },
    status: { type: "select", options: ["todo", "in_progress", "done"] },
    priority: { type: "number" },
  } as const

  const filter = queryBuilder.buildFilter(schema, {
    $or: [
      { status: "todo" },
      {
        $and: [{ priority: { $gte: 5 } }, { title: { $contains: "重要" } }],
      },
    ],
  })

  expect(filter).toEqual({
    or: [
      { property: "status", select: { equals: "todo" } },
      {
        and: [
          { property: "priority", number: { greater_than_or_equal_to: 5 } },
          { property: "title", title: { contains: "重要" } },
        ],
      },
    ],
  })
})

test("buildFilter: フォーミュラ型のフィルター", () => {
  const schema: Schema = {
    calculated: { type: "formula", formulaType: "number" },
    status: { type: "formula", formulaType: "string" },
    isActive: { type: "formula", formulaType: "boolean" },
  }

  // 数値フォーミュラ
  const numberFormula = queryBuilder.buildFilter(schema, {
    calculated: 100,
  })
  expect(numberFormula).toEqual({
    property: "calculated",
    formula: { number: { equals: 100 } },
  })

  // 文字列フォーミュラ
  const stringFormula = queryBuilder.buildFilter(schema, {
    status: "active",
  })
  expect(stringFormula).toEqual({
    property: "status",
    formula: { string: { equals: "active" } },
  })

  // 真偽値フォーミュラ
  const booleanFormula = queryBuilder.buildFilter(schema, {
    isActive: true,
  })
  expect(booleanFormula).toEqual({
    property: "isActive",
    formula: { boolean: { equals: true } },
  })
})

test("buildFilter: 空の条件", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const filter = queryBuilder.buildFilter(schema, {})
  expect(filter).toEqual({})
})

test("buildSort: ソート条件の変換", () => {
  const _schema: Schema = {
    title: { type: "title" },
    priority: { type: "number" },
  }

  // 単一ソート
  const singleSort = queryBuilder.buildSort([
    { field: "priority", direction: "desc" },
  ])
  expect(singleSort).toEqual([
    { property: "priority", direction: "descending" },
  ])

  // 複数ソート
  const multiSort = queryBuilder.buildSort([
    { field: "priority", direction: "desc" },
    { field: "title", direction: "asc" },
  ])
  expect(multiSort).toEqual([
    { property: "priority", direction: "descending" },
    { property: "title", direction: "ascending" },
  ])
})

test("buildFilter: 日付型の様々な形式", () => {
  const schema: Schema = {
    deadline: { type: "date" },
  }

  // DateRange型
  const dateRangeFilter = queryBuilder.buildFilter(schema, {
    deadline: { start: "2024-01-01T00:00:00Z", end: null },
  })
  expect(dateRangeFilter).toEqual({
    property: "deadline",
    date: { on: "2024-01-01" },
  })

  // Date型
  const dateFilter = queryBuilder.buildFilter(schema, {
    deadline: { start: "2024-01-01T12:34:56Z", end: null },
  })
  expect(dateFilter).toEqual({
    property: "deadline",
    date: { on: "2024-01-01" },
  })

  // 文字列型
  const stringDateFilter = queryBuilder.buildFilter(schema, {
    deadline: { start: "2024-01-01T00:00:00Z", end: null },
  })
  expect(stringDateFilter).toEqual({
    property: "deadline",
    date: { on: "2024-01-01" },
  })
})

test("buildFilter: 無効なプロパティはスキップ", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const filter = queryBuilder.buildFilter(schema, {
    title: "有効",
  })

  expect(filter).toEqual({
    property: "title",
    title: { contains: "有効" },
  })
})
