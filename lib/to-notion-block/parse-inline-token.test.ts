import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import { parseInlineToken } from "./parse-inline-token"

test("プレーンテキストを変換", () => {
  const token: Tokens.Text = {
    type: "text",
    raw: "Plain text",
    text: "Plain text",
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Plain text" },
    annotations: {},
  })
})

test("太字テキストを変換", () => {
  const token: Tokens.Strong = {
    type: "strong",
    raw: "**Bold text**",
    text: "Bold text",
    tokens: [
      {
        type: "text",
        raw: "Bold text",
        text: "Bold text",
      } as Tokens.Text,
    ],
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Bold text" },
    annotations: {
      bold: true,
    },
  })
})

test("イタリックテキストを変換", () => {
  const token: Tokens.Em = {
    type: "em",
    raw: "*Italic text*",
    text: "Italic text",
    tokens: [
      {
        type: "text",
        raw: "Italic text",
        text: "Italic text",
      } as Tokens.Text,
    ],
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Italic text" },
    annotations: {
      italic: true,
    },
  })
})

test("インラインコードを変換", () => {
  const token: Tokens.Codespan = {
    type: "codespan",
    raw: "`code`",
    text: "code",
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "code" },
    annotations: {
      code: true,
    },
  })
})

test("取り消し線テキストを変換", () => {
  const token: Tokens.Del = {
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
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Strikethrough" },
    annotations: {
      strikethrough: true,
    },
  })
})

test("太字とイタリックの組み合わせを変換", () => {
  const innerToken: Tokens.Em = {
    type: "em",
    raw: "*Bold Italic*",
    text: "Bold Italic",
    tokens: [
      {
        type: "text",
        raw: "Bold Italic",
        text: "Bold Italic",
      } as Tokens.Text,
    ],
  }

  const token: Tokens.Strong = {
    type: "strong",
    raw: "***Bold Italic***",
    text: "Bold Italic",
    tokens: [innerToken],
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Bold Italic" },
    annotations: {
      bold: true,
    },
  })
})

test("改行文字を含むテキストを変換", () => {
  const token: Tokens.Text = {
    type: "text",
    raw: "Line 1\nLine 2",
    text: "Line 1\nLine 2",
  }

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Line 1\nLine 2" },
    annotations: {},
  })
})

test("未知のトークンタイプをテキストとして扱う", () => {
  const token = {
    type: "unknown",
    raw: "Unknown token",
    text: "Unknown token",
  } as unknown as Tokens.Generic

  const result = parseInlineToken(token)

  expect(result).toEqual({
    type: "text",
    text: { content: "Unknown token" },
    annotations: {},
  })
})
