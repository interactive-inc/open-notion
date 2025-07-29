import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import { parseNumberedListItemToken } from "./parse-numbered-list-item-token"

test("シンプルな番号付きリストアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "1. First item",
    task: false,
    checked: undefined,
    loose: false,
    text: "First item",
    tokens: [
      {
        type: "text",
        raw: "First item",
        text: "First item",
      } as Tokens.Text,
    ],
  }

  const result = parseNumberedListItemToken(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "First item" },
          annotations: {},
        },
      ],
      children: undefined,
    },
  })
})

test("ネストされた番号付きリストを含むアイテムを変換", () => {
  const nestedItem: Tokens.ListItem = {
    type: "list_item",
    raw: "   1. Nested numbered",
    task: false,
    checked: undefined,
    loose: false,
    text: "Nested numbered",
    tokens: [
      {
        type: "text",
        raw: "Nested numbered",
        text: "Nested numbered",
      } as Tokens.Text,
    ],
  }

  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "1. Parent numbered\n   1. Nested numbered",
    task: false,
    checked: undefined,
    loose: false,
    text: "Parent numbered",
    tokens: [
      {
        type: "text",
        raw: "Parent numbered",
        text: "Parent numbered",
      } as Tokens.Text,
      {
        type: "list",
        raw: "   1. Nested numbered",
        ordered: true,
        start: "1",
        loose: false,
        items: [nestedItem],
      } as Tokens.List,
    ],
  }

  const result = parseNumberedListItemToken(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Parent numbered" },
          annotations: {},
        },
      ],
      children: [
        {
          type: "numbered_list_item",
          numbered_list_item: {
            rich_text: [
              {
                type: "text",
                text: { content: "Nested numbered" },
                annotations: {},
              },
            ],
          },
        },
      ],
    },
  })
})

test("箇条書きが混在するネストを変換", () => {
  const nestedItem: Tokens.ListItem = {
    type: "list_item",
    raw: "   - Bullet nested",
    task: false,
    checked: undefined,
    loose: false,
    text: "Bullet nested",
    tokens: [
      {
        type: "text",
        raw: "Bullet nested",
        text: "Bullet nested",
      } as Tokens.Text,
    ],
  }

  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "1. Numbered parent\n   - Bullet nested",
    task: false,
    checked: undefined,
    loose: false,
    text: "Numbered parent",
    tokens: [
      {
        type: "text",
        raw: "Numbered parent",
        text: "Numbered parent",
      } as Tokens.Text,
      {
        type: "list",
        raw: "   - Bullet nested",
        ordered: false,
        start: "",
        loose: false,
        items: [nestedItem],
      } as Tokens.List,
    ],
  }

  const result = parseNumberedListItemToken(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Numbered parent" },
          annotations: {},
        },
      ],
      children: [
        {
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [
              {
                type: "text",
                text: { content: "Bullet nested" },
                annotations: {},
              },
            ],
          },
        },
      ],
    },
  })
})

test("複数のインライン要素を含むアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "1. **Bold** and *italic*",
    task: false,
    checked: undefined,
    loose: false,
    text: "Bold and italic",
    tokens: [
      {
        type: "text",
        raw: "**Bold** and *italic*",
        text: "Bold and italic",
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
            raw: " and ",
            text: " and ",
          } as Tokens.Text,
          {
            type: "em",
            raw: "*italic*",
            text: "italic",
            tokens: [
              {
                type: "text",
                raw: "italic",
                text: "italic",
              } as Tokens.Text,
            ],
          } as Tokens.Em,
        ],
      } as Tokens.Text,
    ],
  }

  const result = parseNumberedListItemToken(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bold and italic" },
          annotations: {},
        },
      ],
      children: undefined,
    },
  })
})

test("テキストトークンがない場合エラーをスロー", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "1. ",
    task: false,
    checked: undefined,
    loose: false,
    text: "",
    tokens: [],
  }

  expect(() => parseNumberedListItemToken(item)).toThrow(
    "Text token not found in list item",
  )
})
