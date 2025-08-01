import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import type { RichTextItemResponse } from "@/types"
import { parseLastNumberedListItem } from "./parse-last-numbered-list-item-token"

test("最後の番号付きアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "3. Last numbered item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Last numbered item",
    tokens: [
      {
        type: "text",
        raw: "Last numbered item",
        text: "Last numbered item",
      } as Tokens.Text,
    ],
  }

  const result = parseLastNumberedListItem(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Last numbered item" },
          plain_text: "Last numbered item",
          annotations: {},
        } as RichTextItemResponse,
      ],
    },
  })
})

test("イタリックを含む最後の番号付きアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "10. *Italic* last item",
    task: false,
    checked: undefined,
    loose: false,
    text: "Italic last item",
    tokens: [
      {
        type: "text",
        raw: "*Italic* last item",
        text: "Italic last item",
        tokens: [
          {
            type: "em",
            raw: "*Italic*",
            text: "Italic",
            tokens: [
              {
                type: "text",
                raw: "Italic",
                text: "Italic",
              } as Tokens.Text,
            ],
          } as Tokens.Em,
          {
            type: "text",
            raw: " last item",
            text: " last item",
          } as Tokens.Text,
        ],
      } as Tokens.Text,
    ],
  }

  const result = parseLastNumberedListItem(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Italic last item" },
          plain_text: "Italic last item",
          annotations: {},
        } as RichTextItemResponse,
      ],
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

  expect(() => parseLastNumberedListItem(item)).toThrow(
    "Text token not found in list item",
  )
})

test("取り消し線を含む最後のアイテムを変換", () => {
  const item: Tokens.ListItem = {
    type: "list_item",
    raw: "99. ~~Strikethrough~~ text",
    task: false,
    checked: undefined,
    loose: false,
    text: "Strikethrough text",
    tokens: [
      {
        type: "text",
        raw: "~~Strikethrough~~ text",
        text: "Strikethrough text",
        tokens: [
          {
            type: "del",
            raw: "~~Strikethrough~~",
            text: "Strikethrough",
            tokens: [
              {
                type: "text",
                raw: "Strikethrough",
                text: "Strikethrough",
              } as Tokens.Text,
            ],
          } as Tokens.Del,
          {
            type: "text",
            raw: " text",
            text: " text",
          } as Tokens.Text,
        ],
      } as Tokens.Text,
    ],
  }

  const result = parseLastNumberedListItem(item)

  expect(result).toEqual({
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: [
        {
          type: "text",
          text: { content: "Strikethrough text" },
          plain_text: "Strikethrough text",
          annotations: {},
        } as RichTextItemResponse,
      ],
    },
  })
})
