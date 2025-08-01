import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import type { RichTextItemResponse } from "@/types"
import { parseBulletedListItemToken } from "./parse-bulleted-list-item-token"

test("シンプルな箇条書きアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- Item 1",
    task: false,
    checked: undefined,
    loose: false,
    text: "Item 1",
    tokens: [
      {
        type: "text",
        raw: "Item 1",
        text: "Item 1",
      } as Tokens.Text,
    ],
  }

  const result = parseBulletedListItemToken(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Item 1" },
          plain_text: "Item 1",
          annotations: {},
        } as RichTextItemResponse,
      ],
      children: undefined,
    },
  })
})

test("ネストされた箇条書きを含むアイテムを変換", () => {
  const nestedItem: Tokens.ListItem = {
    type: "list_item",
    raw: "  - Nested item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Nested item",
    tokens: [
      {
        type: "text",
        raw: "Nested item",
        text: "Nested item",
      } as Tokens.Text,
    ],
  }

  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- Parent item\n  - Nested item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Parent item",
    tokens: [
      {
        type: "text",
        raw: "Parent item",
        text: "Parent item",
      } as Tokens.Text,
      {
        type: "list",
        raw: "  - Nested item",
        ordered: false,
        start: "",
        loose: false,
        items: [nestedItem],
      } as Tokens.List,
    ],
  }

  const result = parseBulletedListItemToken(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Parent item" },
          plain_text: "Parent item",
          annotations: {},
        } as RichTextItemResponse,
      ],
      children: [
        {
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [
              {
                type: "text",
                text: { content: "Nested item" },
                plain_text: "Nested item",
                annotations: {},
              } as RichTextItemResponse,
            ],
          },
        },
      ],
    },
  })
})

test("太字を含む箇条書きアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- **Bold** item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Bold item",
    tokens: [
      {
        type: "text",
        raw: "**Bold** item",
        text: "Bold item",
        tokens: [
          {
            type: "strong",
            raw: "**Bold**",
            text: "Bold",
            tokens: [
              {
                type: "text",
                raw: "Bold",
                text: "Bold",
              } as Tokens.Text,
            ],
          } as Tokens.Strong,
          {
            type: "text",
            raw: " item",
            text: " item",
          } as Tokens.Text,
        ],
      } as Tokens.Text,
    ],
  }

  const result = parseBulletedListItemToken(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bold item" },
          plain_text: "Bold item",
          annotations: {},
        } as RichTextItemResponse,
      ],
      children: undefined,
    },
  })
})

test("テキストトークンがない場合エラーをスロー", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- ",
    task: false,
    checked: undefined,
    loose: false,
    text: "",
    tokens: [],
  }

  expect(() => parseBulletedListItemToken(item)).toThrow(
    "Text token not found in list item",
  )
})

test("番号付きリストが混在するネストを変換", () => {
  const nestedItem: Tokens.ListItem = {
    type: "list_item",
    raw: "  1. Numbered nested",
    task: false,
    checked: undefined,
    loose: false,
    text: "Numbered nested",
    tokens: [
      {
        type: "text",
        raw: "Numbered nested",
        text: "Numbered nested",
      } as Tokens.Text,
    ],
  }

  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- Bullet parent\n  1. Numbered nested",
    task: false,
    checked: undefined,
    loose: false,
    text: "Bullet parent",
    tokens: [
      {
        type: "text",
        raw: "Bullet parent",
        text: "Bullet parent",
      } as Tokens.Text,
      {
        type: "list",
        raw: "  1. Numbered nested",
        ordered: true,
        start: 1,
        loose: false,
        items: [nestedItem],
      } as Tokens.List,
    ],
  }

  const result = parseBulletedListItemToken(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bullet parent" },
          plain_text: "Bullet parent",
          annotations: {},
        } as RichTextItemResponse,
      ],
      children: [
        {
          type: "numbered_list_item",
          numbered_list_item: {
            rich_text: [
              {
                type: "text",
                text: { content: "Numbered nested" },
                plain_text: "Numbered nested",
                annotations: {},
              } as RichTextItemResponse,
            ],
          },
        },
      ],
    },
  })
})
