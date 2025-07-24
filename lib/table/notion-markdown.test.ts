import { expect, test } from "bun:test"
import { NotionMarkdown } from "./notion-markdown"

test("デフォルトの動作", () => {
  const enhancer = new NotionMarkdown()

  expect(enhancer.enhanceBlockType("heading_1")).toBe("heading_1")
  expect(enhancer.enhanceBlockType("heading_2")).toBe("heading_2")
  expect(enhancer.enhanceBlockType("paragraph")).toBe("paragraph")
})

test("カスタムマッピングの適用", () => {
  const enhancer = new NotionMarkdown({
    heading_1: "heading_2",
    heading_2: "heading_3",
    heading_3: "heading_4",
  })

  expect(enhancer.enhanceBlockType("heading_1")).toBe("heading_2")
  expect(enhancer.enhanceBlockType("heading_2")).toBe("heading_3")
  expect(enhancer.enhanceBlockType("heading_3")).toBe("heading_4")
  expect(enhancer.enhanceBlockType("paragraph")).toBe("paragraph")
})

test("マッピングの更新", () => {
  const enhancer = new NotionMarkdown()

  enhancer.setMapping({
    heading_1: "heading_2",
    paragraph: "callout",
  })

  expect(enhancer.enhanceBlockType("heading_1")).toBe("heading_2")
  expect(enhancer.enhanceBlockType("paragraph")).toBe("callout")
})

test("マッピングの取得", () => {
  const mapping = {
    heading_1: "heading_2",
    heading_2: "heading_3",
  }

  const enhancer = new NotionMarkdown(mapping)
  const retrieved = enhancer.getMapping()

  expect(retrieved).toEqual(mapping)

  // コピーが返されることを確認
  retrieved.heading_1 = "heading_4"
  expect(enhancer.getMapping().heading_1).toBe("heading_2")
})

test("未定義のブロックタイプ", () => {
  const enhancer = new NotionMarkdown({
    heading_1: "heading_2",
  })

  expect(enhancer.enhanceBlockType("unknown_type")).toBe("unknown_type")
})
