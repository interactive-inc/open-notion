import { expect, test } from "bun:test"
import type { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { PageReference } from "./notion-page-reference"
import { NotionQueryResult } from "./notion-query-result"

test("ページ参照の配列を取得できる", () => {
  const mockClient = {} as Client
  const pageRef1 = new PageReference({
    notion: mockClient,
    pageId: "page-1",
    properties: { title: "Page 1" },
    rawData: { id: "page-1" } as PageObjectResponse,
  })
  const pageRef2 = new PageReference({
    notion: mockClient,
    pageId: "page-2",
    properties: { title: "Page 2" },
    rawData: { id: "page-2" } as PageObjectResponse,
  })

  const queryResult = new NotionQueryResult({
    pageReferences: [pageRef1, pageRef2],
    cursor: "next-cursor",
    hasMore: true,
  })

  const refs = queryResult.pageReferences()
  expect(refs).toHaveLength(2)
  expect(refs[0]).toBe(pageRef1)
  expect(refs[1]).toBe(pageRef2)
})

test("カーソルを取得できる", () => {
  const queryResult = new NotionQueryResult({
    pageReferences: [],
    cursor: "next-page-cursor",
    hasMore: true,
  })

  expect(queryResult.cursor()).toBe("next-page-cursor")
})

test("カーソルがnullの場合", () => {
  const queryResult = new NotionQueryResult({
    pageReferences: [],
    cursor: null,
    hasMore: false,
  })

  expect(queryResult.cursor()).toBeNull()
})

test("さらにページがあるかを確認できる", () => {
  const queryResultWithMore = new NotionQueryResult({
    pageReferences: [],
    cursor: "cursor",
    hasMore: true,
  })

  const queryResultNoMore = new NotionQueryResult({
    pageReferences: [],
    cursor: null,
    hasMore: false,
  })

  expect(queryResultWithMore.hasMore()).toBe(true)
  expect(queryResultNoMore.hasMore()).toBe(false)
})

test("ページ数を取得できる", () => {
  const mockClient = {} as Client
  const pageRefs = Array.from(
    { length: 5 },
    (_, i) =>
      new PageReference({
        notion: mockClient,
        pageId: `page-${i}`,
        properties: { title: `Page ${i}` },
        rawData: { id: `page-${i}` } as PageObjectResponse,
      }),
  )

  const queryResult = new NotionQueryResult({
    pageReferences: pageRefs,
    cursor: null,
    hasMore: false,
  })

  expect(queryResult.length()).toBe(5)
})

test("空の結果の場合", () => {
  const queryResult = new NotionQueryResult({
    pageReferences: [],
    cursor: null,
    hasMore: false,
  })

  expect(queryResult.pageReferences()).toEqual([])
  expect(queryResult.length()).toBe(0)
  expect(queryResult.hasMore()).toBe(false)
  expect(queryResult.cursor()).toBeNull()
})

test("イミュータブルなオブジェクトである", () => {
  const queryResult = new NotionQueryResult({
    pageReferences: [],
    cursor: null,
    hasMore: false,
  })

  expect(Object.isFrozen(queryResult)).toBe(true)
})

test("型安全なプロパティを持つページ参照を扱える", () => {
  type ArticleProperties = {
    title: string
    author: string
    publishedDate: Date
    tags: string[]
  }

  const mockClient = {} as Client
  const articleRef = new PageReference<ArticleProperties>({
    notion: mockClient,
    pageId: "article-1",
    properties: {
      title: "TypeScriptの基礎",
      author: "山田太郎",
      publishedDate: new Date("2024-01-01"),
      tags: ["TypeScript", "プログラミング"],
    },
    rawData: { id: "article-1" } as PageObjectResponse,
  })

  const queryResult = new NotionQueryResult<ArticleProperties>({
    pageReferences: [articleRef],
    cursor: null,
    hasMore: false,
  })

  const refs = queryResult.pageReferences()
  const props = refs[0]?.properties()
  expect(props?.title).toBe("TypeScriptの基礎")
  expect(props?.author).toBe("山田太郎")
  expect(props?.tags).toContain("TypeScript")
})
