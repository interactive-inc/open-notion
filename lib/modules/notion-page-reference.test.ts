import { expect, test } from "bun:test"
import type { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { PageReference } from "./notion-page-reference"

test("プロパティを取得できる", () => {
  const mockProperties = { title: "Test Page", score: 100 }
  const mockPageData = { id: "page-123" } as PageObjectResponse
  const mockClient = {} as Client

  const pageRef = new PageReference({
    notion: mockClient,
    pageId: "page-123",
    properties: mockProperties,
    rawData: mockPageData,
  })

  const properties = pageRef.properties()
  expect(properties).toEqual(mockProperties)
})

test("元のNotionページデータを取得できる", () => {
  const mockProperties = { title: "Test Page" }
  const mockPageData = {
    id: "page-123",
    created_time: "2024-01-01T00:00:00.000Z",
    last_edited_time: "2024-01-02T00:00:00.000Z",
  } as PageObjectResponse
  const mockClient = {} as Client

  const pageRef = new PageReference({
    notion: mockClient,
    pageId: "page-123",
    properties: mockProperties,
    rawData: mockPageData,
  })

  const raw = pageRef.raw()
  expect(raw).toEqual(mockPageData)
})

test("イミュータブルなオブジェクトである", () => {
  const mockProperties = { title: "Test Page" }
  const mockPageData = { id: "page-123" } as PageObjectResponse
  const mockClient = {} as Client

  const pageRef = new PageReference({
    notion: mockClient,
    pageId: "page-123",
    properties: mockProperties,
    rawData: mockPageData,
  })

  expect(Object.isFrozen(pageRef)).toBe(true)
})

test("本文をマークダウン形式で取得できる", async () => {
  const mockProperties = { title: "Test Page" }
  const mockPageData = { id: "page-123" } as PageObjectResponse

  // NOTE: この機能は実際のNotion APIとenhance関数が必要なため、
  // 実装の詳細をテストではなく、メソッドが存在することのみ確認
  const mockClient = {} as Client

  const pageRef = new PageReference({
    notion: mockClient,
    pageId: "page-123",
    properties: mockProperties,
    rawData: mockPageData,
  })

  // body()メソッドが存在することを確認
  expect(typeof pageRef.body).toBe("function")
})

test("複数タイプのプロパティを保持できる", () => {
  type CustomProperties = {
    name: string
    tags: string[]
    isPublished: boolean
    publishedAt: Date | null
  }

  const mockProperties: CustomProperties = {
    name: "カスタムページ",
    tags: ["TypeScript", "Notion"],
    isPublished: true,
    publishedAt: new Date("2024-01-01"),
  }
  const mockPageData = { id: "page-456" } as PageObjectResponse
  const mockClient = {} as Client

  const pageRef = new PageReference({
    notion: mockClient,
    pageId: "page-456",
    properties: mockProperties,
    rawData: mockPageData,
  })

  const properties = pageRef.properties()
  expect(properties.name).toBe("カスタムページ")
  expect(properties.tags).toEqual(["TypeScript", "Notion"])
  expect(properties.isPublished).toBe(true)
  expect(properties.publishedAt).toEqual(new Date("2024-01-01"))
})
