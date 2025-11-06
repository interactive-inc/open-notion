import { expect, test } from "bun:test"
import type { NotionBlock, NotionPage } from "@/types"
import { NotionMemoryCache } from "./notion-memory-cache"

const createMockPage = (id: string): NotionPage => {
  return {
    id: id,
    object: "page",
    created_time: "2024-01-01T00:00:00.000Z",
    last_edited_time: "2024-01-01T00:00:00.000Z",
    archived: false,
    properties: {},
    url: `https://notion.so/${id}`,
    parent: { type: "database_id", database_id: "test-db" },
  } as NotionPage
}

const createMockBlocks = (): NotionBlock[] => {
  return [
    {
      id: "block-1",
      type: "paragraph",
      object: "block",
      created_time: "2024-01-01T00:00:00.000Z",
      last_edited_time: "2024-01-01T00:00:00.000Z",
      has_children: false,
      archived: false,
      children: [],
    },
  ] as NotionBlock[]
}

test("ページキャッシュの基本操作", () => {
  const cache = new NotionMemoryCache()
  const page1 = createMockPage("page-1")
  const page2 = createMockPage("page-2")

  cache.setPage("page-1", page1)
  const result = cache.getPage("page-1")
  expect(result).toEqual(page1)

  cache.setPage("page-2", page2)
  expect(cache.getPage("page-2")).toEqual(page2)

  const notFound = cache.getPage("page-3")
  expect(notFound).toBeNull()
})

test("ブロックキャッシュの基本操作", () => {
  const cache = new NotionMemoryCache()
  const blocks1 = createMockBlocks()
  const blocks2 = createMockBlocks()

  cache.setBlocks("page-1", blocks1)
  const result = cache.getBlocks("page-1")
  expect(result).toEqual(blocks1)

  cache.setBlocks("page-2", blocks2)
  expect(cache.getBlocks("page-2")).toEqual(blocks2)

  const notFound = cache.getBlocks("page-3")
  expect(notFound).toBeNull()
})

test("個別削除", () => {
  const cache = new NotionMemoryCache()
  const page = createMockPage("page-1")
  const blocks = createMockBlocks()

  cache.setPage("page-1", page)
  cache.setBlocks("page-1", blocks)

  cache.deletePage("page-1")
  expect(cache.getPage("page-1")).toBeNull()
  expect(cache.getBlocks("page-1")).toEqual(blocks)

  cache.deleteBlocks("page-1")
  expect(cache.getBlocks("page-1")).toBeNull()
})

test("全削除", () => {
  const cache = new NotionMemoryCache()
  const page = createMockPage("page-1")
  const blocks = createMockBlocks()

  cache.setPage("page-1", page)
  cache.setBlocks("page-1", blocks)

  cache.clear()
  expect(cache.getPage("page-1")).toBeNull()
  expect(cache.getBlocks("page-1")).toBeNull()
})

test("同じキーで上書き", () => {
  const cache = new NotionMemoryCache()
  const page1 = createMockPage("page-1")
  const page2 = createMockPage("page-2")

  cache.setPage("key", page1)
  expect(cache.getPage("key")).toEqual(page1)

  cache.setPage("key", page2)
  expect(cache.getPage("key")).toEqual(page2)

  const blocks1 = createMockBlocks()
  const blocks2 = createMockBlocks()

  cache.setBlocks("key", blocks1)
  expect(cache.getBlocks("key")).toEqual(blocks1)

  cache.setBlocks("key", blocks2)
  expect(cache.getBlocks("key")).toEqual(blocks2)
})
