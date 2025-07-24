import { expect, test } from "bun:test"
import { NotionMemoryCache } from "./notion-memory-cache"

test("基本的なキャッシュ操作", () => {
  const cache = new NotionMemoryCache()

  // 値の設定と取得
  cache.set("key1", { data: "value1" })
  const result = cache.get<{ data: string }>("key1")
  expect(result).toEqual({ data: "value1" })

  // 存在しないキーの取得
  const notFound = cache.get<string>("key2")
  expect(notFound).toBeNull()
})

test("手動削除", () => {
  const cache = new NotionMemoryCache()

  cache.set("key1", "value1")
  cache.set("key2", "value2")

  // 個別削除
  cache.delete("key1")
  expect(cache.get<string>("key1")).toBeNull()
  expect(cache.get<string>("key2")).toBe("value2")
})

test("全削除", () => {
  const cache = new NotionMemoryCache()

  cache.set("key1", "value1")
  cache.set("key2", "value2")
  cache.set("key3", "value3")

  // 全削除
  cache.clear()
  expect(cache.get<string>("key1")).toBeNull()
  expect(cache.get<string>("key2")).toBeNull()
  expect(cache.get<string>("key3")).toBeNull()
  expect(cache.size).toBe(0)
})

test("異なる型の値を保存", () => {
  const cache = new NotionMemoryCache()

  // 文字列
  cache.set("string", "text")
  expect(cache.get<string>("string")).toBe("text")

  // 数値
  cache.set("number", 42)
  expect(cache.get<number>("number")).toBe(42)

  // オブジェクト
  const obj = { name: "test", value: 123 }
  cache.set("object", obj)
  expect(cache.get<typeof obj>("object")).toEqual(obj)

  // 配列
  const arr = [1, 2, 3]
  cache.set("array", arr)
  expect(cache.get<number[]>("array")).toEqual(arr)
})

test("同じキーで上書き", () => {
  const cache = new NotionMemoryCache()

  cache.set("key", "value1")
  expect(cache.get<string>("key")).toBe("value1")

  // 上書き
  cache.set("key", "value2")
  expect(cache.get<string>("key")).toBe("value2")
})

test("キャッシュサイズ", () => {
  const cache = new NotionMemoryCache()

  expect(cache.size).toBe(0)

  cache.set("key1", "value1")
  expect(cache.size).toBe(1)

  cache.set("key2", "value2")
  expect(cache.size).toBe(2)

  cache.delete("key1")
  expect(cache.size).toBe(1)

  cache.clear()
  expect(cache.size).toBe(0)
})
