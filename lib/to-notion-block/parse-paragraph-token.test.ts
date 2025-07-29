import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import { parseParagraphToken } from "./parse-paragraph-token"

test("シンプルなテキストの段落を変換", () => {
  const token: Tokens.Paragraph = {
    type: "paragraph",
    raw: "This is a simple paragraph.",
    text: "This is a simple paragraph.",
    tokens: [
      {
        type: "text",
        raw: "This is a simple paragraph.",
        text: "This is a simple paragraph.",
      } as Tokens.Text,
    ],
  }

  const result = parseParagraphToken(token)

  expect(result).toEqual({
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "This is a simple paragraph." },
          annotations: {},
        },
      ],
    },
  })
})

test("太字を含む段落を変換", () => {
  const token: Tokens.Paragraph = {
    type: "paragraph",
    raw: "This is **bold** text.",
    text: "This is bold text.",
    tokens: [
      {
        type: "text",
        raw: "This is ",
        text: "This is ",
      } as Tokens.Text,
      {
        type: "strong",
        raw: "**bold**",
        text: "bold",
        tokens: [
          {
            type: "text",
            raw: "bold",
            text: "bold",
          } as Tokens.Text,
        ],
      } as Tokens.Strong,
      {
        type: "text",
        raw: " text.",
        text: " text.",
      } as Tokens.Text,
    ],
  }

  const result = parseParagraphToken(token)

  expect(result).toEqual({
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "This is " },
          annotations: {},
        },
        {
          type: "text",
          text: { content: "bold" },
          annotations: {
            bold: true,
          },
        },
        {
          type: "text",
          text: { content: " text." },
          annotations: {},
        },
      ],
    },
  })
})

test("複数の装飾を含む段落を変換", () => {
  const token: Tokens.Paragraph = {
    type: "paragraph",
    raw: "**Bold**, *italic*, `code` and ~~strikethrough~~.",
    text: "Bold, italic, code and strikethrough.",
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
        raw: ", ",
        text: ", ",
      } as Tokens.Text,
      {
        type: "codespan",
        raw: "`code`",
        text: "code",
      } as Tokens.Codespan,
      {
        type: "text",
        raw: " and ",
        text: " and ",
      } as Tokens.Text,
      {
        type: "del",
        raw: "~~strikethrough~~",
        text: "strikethrough",
        tokens: [
          {
            type: "text",
            raw: "strikethrough",
            text: "strikethrough",
          } as Tokens.Text,
        ],
      } as Tokens.Del,
      {
        type: "text",
        raw: ".",
        text: ".",
      } as Tokens.Text,
    ],
  }

  const result = parseParagraphToken(token)

  expect(result).toEqual({
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bold" },
          annotations: {
            bold: true,
          },
        },
        {
          type: "text",
          text: { content: ", " },
          annotations: {},
        },
        {
          type: "text",
          text: { content: "italic" },
          annotations: {
            italic: true,
          },
        },
        {
          type: "text",
          text: { content: ", " },
          annotations: {},
        },
        {
          type: "text",
          text: { content: "code" },
          annotations: {
            code: true,
          },
        },
        {
          type: "text",
          text: { content: " and " },
          annotations: {},
        },
        {
          type: "text",
          text: { content: "strikethrough" },
          annotations: {
            strikethrough: true,
          },
        },
        {
          type: "text",
          text: { content: "." },
          annotations: {},
        },
      ],
    },
  })
})

test("空の段落を変換", () => {
  const token: Tokens.Paragraph = {
    type: "paragraph",
    raw: "",
    text: "",
    tokens: [],
  }

  const result = parseParagraphToken(token)

  expect(result).toEqual({
    type: "paragraph",
    paragraph: {
      rich_text: [],
    },
  })
})
