import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import { parseLastBulletedListItem } from "./parse-last-bulleted-list-item-token"

test("最後の箇条書きアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- Last item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Last item",
    tokens: [
      {
        type: "text",
        raw: "Last item",
        text: "Last item",
      } as Tokens.Text,
    ],
  }

  const result = parseLastBulletedListItem(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Last item" },
          annotations: {},
        },
      ],
    },
  })
})

test("太字を含む最後の箇条書きアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- **Bold** last item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Bold last item",
    tokens: [
      {
        type: "text",
        raw: "**Bold** last item",
        text: "Bold last item",
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
            raw: " last item",
            text: " last item",
          } as Tokens.Text,
        ],
      } as Tokens.Text,
    ],
  }

  const result = parseLastBulletedListItem(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bold last item" },
          annotations: {},
        },
      ],
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

  expect(() => parseLastBulletedListItem(item)).toThrow(
    "Text token not found in list item",
  )
})

test("複数のインライン要素を含む最後のアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "- **Bold**, *italic* and `code`",
    task: false,
    checked: undefined,
    loose: false,
    text: "Bold, italic and code",
    tokens: [
      {
        type: "text",
        raw: "**Bold**, *italic* and `code`",
        text: "Bold, italic and code",
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
            raw: ", ",
            text: ", ",
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
          {
            type: "text",
            raw: " and ",
            text: " and ",
          } as Tokens.Text,
          {
            type: "codespan",
            raw: "`code`",
            text: "code",
          } as Tokens.Codespan,
        ],
      } as Tokens.Text,
    ],
  }

  const result = parseLastBulletedListItem(item)

  expect(result).toEqual({
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bold, italic and code" },
          annotations: {},
        },
      ],
    },
  })
})
