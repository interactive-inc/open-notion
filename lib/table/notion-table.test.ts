import { expect, test } from "bun:test"
import type { Client } from "@notionhq/client"
import type { Schema } from "@/types"
import { NotionMarkdown } from "./notion-markdown"
import { NotionTable } from "./notion-table"

// 簡易的な統合テスト（実際のNotionクライアントの動作に近いモック）
test("基本的な統合テスト", async () => {
  // 実際のNotionクライアントのようなレスポンスを返すモック
  const mockNotion = {
    dataSources: {
      query: async () => ({
        results: [
          {
            id: "page-1",
            created_time: "2024-01-01T00:00:00Z",
            last_edited_time: "2024-01-01T00:00:00Z",
            archived: false,
            properties: {
              title: { type: "title", title: [{ plain_text: "タスク1" }] },
              status: { type: "select", select: { name: "todo" } },
              priority: { type: "number", number: 3 },
            },
          },
        ],
        next_cursor: null,
        has_more: false,
      }),
    },
    pages: {
      create: async (params: {
        parent: { database_id: string }
        properties: Record<string, unknown>
        children?: unknown[]
      }) => ({
        id: "page-new",
        created_time: "2024-01-01T00:00:00Z",
        last_edited_time: "2024-01-01T00:00:00Z",
        archived: false,
        properties: params.properties,
      }),
      retrieve: async () => ({
        id: "page-new",
        created_time: "2024-01-01T00:00:00Z",
        last_edited_time: "2024-01-01T00:00:00Z",
        archived: false,
        properties: {
          title: { type: "title", title: [{ plain_text: "新規タスク" }] },
          status: { type: "select", select: { name: "todo" } },
        },
      }),
      update: async () => ({}),
    },
    blocks: {
      children: {
        list: async () => ({ results: [] }),
        append: async () => ({}),
      },
      delete: async () => ({}),
    },
  } as unknown as Client

  const schema: Schema = {
    title: { type: "title", required: true },
    status: { type: "select", options: ["todo", "in_progress", "done"] },
    priority: { type: "number" },
  }

  const table = new NotionTable({
    client: mockNotion,
    tableId: "test-db",
    schema,
  })

  // findManyのテスト
  const results = await table.findMany()
  expect(results).toHaveLength(1)
  expect(results[0]?.properties().title).toBe("タスク1")
  expect(results[0]?.properties().status).toBe("todo")
  expect(results[0]?.properties().priority).toBe(3)

  // createのテスト
  const created = await table.create({
    properties: {
      title: "新規タスク",
      status: "todo",
    },
  })
  expect(created.title).toBe("新規タスク")
  expect(created.status).toBe("todo")
})

test("高度なクエリのテスト", async () => {
  const mockNotion = {
    dataSources: {
      query: async (params: {
        database_id: string
        filter?: Record<string, unknown>
        sorts?: Array<Record<string, unknown>>
        start_cursor?: string
        page_size?: number
      }) => {
        // フィルターパラメータが正しく渡されているかチェック
        expect(params.filter).toBeDefined()
        expect(params.filter?.or).toBeDefined()

        return {
          results: [],
          next_cursor: null,
          has_more: false,
        }
      },
    },
    pages: {
      create: async () => ({}),
      retrieve: async () => ({}),
      update: async () => ({}),
    },
    blocks: {
      children: {
        list: async () => ({ results: [] }),
        append: async () => ({}),
      },
      delete: async () => ({}),
    },
  } as unknown as Client

  const schema = {
    status: { type: "select", options: ["todo", "done"] },
    priority: { type: "number" },
  } as const

  const table = new NotionTable({
    client: mockNotion,
    tableId: "test-db",
    schema,
  })

  // 高度なクエリ
  await table.findMany({
    where: {
      $or: [{ status: "todo" }, { priority: { $gte: 5 } }],
    },
  })
})

test("バリデーションとフックのテスト", async () => {
  const mockNotion = {
    dataSources: {
      query: async () => ({ results: [], next_cursor: null, has_more: false }),
    },
    pages: {
      create: async (params: {
        parent: { database_id: string }
        properties: Record<string, unknown>
        children?: unknown[]
      }) => ({
        id: "page-hook",
        created_time: "2024-01-01T00:00:00Z",
        last_edited_time: "2024-01-01T00:00:00Z",
        archived: false,
        properties: params.properties,
      }),
      retrieve: async () => ({
        id: "page-hook",
        created_time: "2024-01-01T00:00:00Z",
        last_edited_time: "2024-01-01T00:00:00Z",
        archived: false,
        properties: {
          email: { type: "email", email: "test@example.com" },
          age: { type: "number", number: 25 },
        },
      }),
      update: async () => ({}),
    },
    blocks: {
      children: {
        list: async () => ({ results: [] }),
        append: async () => ({}),
      },
      delete: async () => ({}),
    },
  } as unknown as Client

  const schema: Schema = {
    email: {
      type: "email",
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== "string") return false
        return value.includes("@") || "有効なメールアドレスを入力してください"
      },
    },
    age: {
      type: "number",
      min: 0,
      max: 120,
    },
  }

  const table = new NotionTable({
    client: mockNotion,
    tableId: "test-db",
    schema,
  })

  // バリデーションエラー
  expect(
    table.create({ properties: { email: "invalid", age: 25 } }),
  ).rejects.toThrow("有効なメールアドレスを入力してください")

  expect(
    table.create({ properties: { email: "test@example.com", age: 150 } }),
  ).rejects.toThrow('Field "age" must be at most 120')

  // フック
  let hookCalled = false
  table.hooks = {
    beforeCreate: async (data) => {
      hookCalled = true
      return data
    },
  }

  await table.create({ properties: { email: "test@example.com", age: 25 } })
  expect(hookCalled).toBe(true)
})

test("NotionMarkdownとの統合", async () => {
  let appendedBlocks: unknown[] = []

  const mockNotion = {
    dataSources: {
      query: async () => ({ results: [], next_cursor: null, has_more: false }),
    },
    pages: {
      create: async (params: {
        parent: { database_id: string }
        properties: Record<string, unknown>
        children?: unknown[]
      }) => {
        if (params.children) {
          appendedBlocks = params.children
        }
        return {
          id: "page-enhanced",
          created_time: "2024-01-01T00:00:00Z",
          last_edited_time: "2024-01-01T00:00:00Z",
          archived: false,
          properties: params.properties,
        }
      },
      retrieve: async () => ({
        id: "page-enhanced",
        created_time: "2024-01-01T00:00:00Z",
        last_edited_time: "2024-01-01T00:00:00Z",
        archived: false,
        properties: {
          title: { type: "title", title: [{ plain_text: "テストページ" }] },
        },
      }),
      update: async () => ({}),
    },
    blocks: {
      children: {
        list: async () => ({ results: [] }),
        append: async (params: { block_id: string; children: unknown[] }) => {
          appendedBlocks = params.children
          return {}
        },
      },
      delete: async () => ({}),
    },
  } as unknown as Client

  const schema: Schema = {
    title: { type: "title", required: true },
  }

  // H1をH2に変換するエンハンサーを設定
  const enhancer = new NotionMarkdown({
    heading_1: "heading_2",
    heading_2: "heading_3",
  })

  const table = new NotionTable({
    client: mockNotion,
    tableId: "test-db",
    schema,
    enhancer,
  })

  // # Title -> heading_1 -> heading_2 に変換される
  await table.create({
    properties: {
      title: "テストページ",
    },
    body: "# Title\n\nParagraph\n\n## Subtitle",
  })

  // 作成されたブロックを確認
  expect(appendedBlocks).toHaveLength(3)
  expect((appendedBlocks[0] as { type: string }).type).toBe("heading_2") // h1 -> h2
  expect((appendedBlocks[1] as { type: string }).type).toBe("paragraph")
  expect((appendedBlocks[2] as { type: string }).type).toBe("heading_3") // h2 -> h3
})

test("エンハンサーなしのデフォルト動作", async () => {
  let appendedBlocks: unknown[] = []

  const mockNotion = {
    dataSources: {
      query: async () => ({ results: [], next_cursor: null, has_more: false }),
    },
    pages: {
      create: async (params: {
        parent: { database_id: string }
        properties: Record<string, unknown>
        children?: unknown[]
      }) => {
        if (params.children) {
          appendedBlocks = params.children
        }
        return {
          id: "page-default",
          created_time: "2024-01-01T00:00:00Z",
          last_edited_time: "2024-01-01T00:00:00Z",
          archived: false,
          properties: params.properties,
        }
      },
      retrieve: async () => ({
        id: "page-default",
        created_time: "2024-01-01T00:00:00Z",
        last_edited_time: "2024-01-01T00:00:00Z",
        archived: false,
        properties: {
          title: { type: "title", title: [{ plain_text: "テストページ" }] },
        },
      }),
      update: async () => ({}),
    },
    blocks: {
      children: {
        list: async () => ({ results: [] }),
        append: async (params: { block_id: string; children: unknown[] }) => {
          appendedBlocks = params.children
          return {}
        },
      },
      delete: async () => ({}),
    },
  } as unknown as Client

  const schema: Schema = {
    title: { type: "title", required: true },
  }

  const table = new NotionTable({
    client: mockNotion,
    tableId: "test-db",
    schema,
    // enhancerを指定しない
  })

  await table.create({
    properties: {
      title: "テストページ",
    },
    body: "# Title",
  })

  // デフォルトではheading_1のまま
  expect(appendedBlocks).toHaveLength(1)
  expect((appendedBlocks[0] as { type: string }).type).toBe("heading_1")
})
