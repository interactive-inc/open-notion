import { expect, test } from "bun:test"
import type { Schema, WhereCondition } from "@/types"
import { toNotionQuery } from "./to-notion-query"

test("シンプルな文字列条件", () => {
  const schema: Schema = {
    slug: { type: "rich_text" },
  }

  const result = toNotionQuery(schema, { slug: "test" })

  expect(result).toEqual({
    property: "slug",
    rich_text: { equals: "test" },
  })
})

test("数値の等価条件", () => {
  const schema: Schema = {
    count: { type: "number" },
  }

  const result = toNotionQuery(schema, { count: 42 })

  expect(result).toEqual({
    property: "count",
    number: { equals: 42 },
  })
})

test("数値の比較演算子", () => {
  const schema: Schema = {
    count: { type: "number" },
  }

  const result = toNotionQuery(schema, {
    and: [
      { count: { greater_than_or_equal_to: 10 } },
      { count: { less_than: 100 } },
    ],
  })

  expect(result).toEqual({
    and: [
      {
        property: "count",
        number: { greater_than_or_equal_to: 10 },
      },
      {
        property: "count",
        number: { less_than: 100 },
      },
    ],
  })
})

test("select の複数条件", () => {
  const schema: Schema = {
    status: { type: "select", options: ["todo", "done"] },
  }

  const result = toNotionQuery(schema, {
    or: [{ status: "todo" }, { status: "done" }],
  })

  expect(result).toEqual({
    or: [
      {
        property: "status",
        select: { equals: "todo" },
      },
      {
        property: "status",
        select: { equals: "done" },
      },
    ],
  })
})

test("or 条件", () => {
  const schema = {
    status: { type: "select", options: ["todo", "done"] },
    priority: { type: "number" },
  } as const

  const result = toNotionQuery(schema, {
    or: [{ status: "todo" }, { priority: { greater_than_or_equal_to: 5 } }],
  })

  expect(result).toEqual({
    or: [
      {
        property: "status",
        select: { equals: "todo" },
      },
      {
        property: "priority",
        number: { greater_than_or_equal_to: 5 },
      },
    ],
  })
})

test("and 条件", () => {
  const schema = {
    status: { type: "select", options: ["todo"] },
    priority: { type: "number" },
  } as const

  const result = toNotionQuery(schema, {
    and: [{ status: "todo" }, { priority: 5 }],
  })

  expect(result).toEqual({
    and: [
      {
        property: "status",
        select: { equals: "todo" },
      },
      {
        property: "priority",
        number: { equals: 5 },
      },
    ],
  })
})

test("複数フィールドは自動的に and になる", () => {
  const schema: Schema = {
    status: { type: "select", options: ["todo"] },
    priority: { type: "number" },
  }

  const result = toNotionQuery(schema, {
    status: "todo",
    priority: 5,
  })

  expect(result).toEqual({
    and: [
      {
        property: "status",
        select: { equals: "todo" },
      },
      {
        property: "priority",
        number: { equals: 5 },
      },
    ],
  })
})

test("checkbox 型", () => {
  const schema: Schema = {
    done: { type: "checkbox" },
  }

  const result = toNotionQuery(schema, { done: true })

  expect(result).toEqual({
    property: "done",
    checkbox: { equals: true },
  })
})

test("multi_select の contains", () => {
  const schema: Schema = {
    tags: { type: "multi_select", options: ["js", "ts"] },
  }

  const result = toNotionQuery(schema, { tags: "js" })

  expect(result).toEqual({
    property: "tags",
    multi_select: { contains: "js" },
  })
})

test("contains 演算子", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const result = toNotionQuery(schema, {
    title: { contains: "test" },
  })

  expect(result).toEqual({
    property: "title",
    title: { contains: "test" },
  })
})

test("空の条件は undefined を返す", () => {
  const schema: Schema = {
    slug: { type: "rich_text" },
  }

  const result = toNotionQuery(schema, {})

  expect(result).toBeUndefined()
})

test("存在しないフィールドは無視される", () => {
  const schema: Schema = {
    slug: { type: "rich_text" },
  }

  const result = toNotionQuery(schema, {
    nonexistent: "value",
  } as WhereCondition<typeof schema>)

  expect(result).toBeUndefined()
})

test("Notion API filter format: equals", () => {
  const schema: Schema = {
    slug: { type: "rich_text" },
  }

  const result = toNotionQuery(schema, {
    slug: { equals: "test-1" },
  })

  expect(result).toEqual({
    property: "slug",
    rich_text: { equals: "test-1" },
  })
})

test("Notion API filter format: contains", () => {
  const schema: Schema = {
    title: { type: "title" },
  }

  const result = toNotionQuery(schema, {
    title: { contains: "hello" },
  })

  expect(result).toEqual({
    property: "title",
    title: { contains: "hello" },
  })
})

test("Notion API filter format: number greater_than", () => {
  const schema: Schema = {
    count: { type: "number" },
  }

  const result = toNotionQuery(schema, {
    count: { greater_than: 10 },
  })

  expect(result).toEqual({
    property: "count",
    number: { greater_than: 10 },
  })
})
