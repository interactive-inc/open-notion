import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import { parseHeadingToken } from "./parse-heading-token"

test("見出しレベル1をNotion heading_1 に変換", () => {
  const token: Tokens.Heading = {
    type: "heading",
    depth: 1,
    raw: "# Title",
    text: "Title",
    tokens: [
      {
        type: "text",
        raw: "Title",
        text: "Title",
      } as Tokens.Text,
    ],
  }

  const result = parseHeadingToken(token)

  expect(result).toEqual({
    type: "heading_1",
    heading_1: {
      rich_text: [
        {
          type: "text",
          text: { content: "Title" },
          annotations: {},
        },
      ],
    },
  })
})

test("見出しレベル2をNotion heading_2 に変換", () => {
  const token: Tokens.Heading = {
    type: "heading",
    depth: 2,
    raw: "## Subtitle",
    text: "Subtitle",
    tokens: [
      {
        type: "text",
        raw: "Subtitle",
        text: "Subtitle",
      } as Tokens.Text,
    ],
  }

  const result = parseHeadingToken(token)

  expect(result).toEqual({
    type: "heading_2",
    heading_2: {
      rich_text: [
        {
          type: "text",
          text: { content: "Subtitle" },
          annotations: {},
        },
      ],
    },
  })
})

test("見出しレベル3をNotion heading_3 に変換", () => {
  const token: Tokens.Heading = {
    type: "heading",
    depth: 3,
    raw: "### Section",
    text: "Section",
    tokens: [
      {
        type: "text",
        raw: "Section",
        text: "Section",
      } as Tokens.Text,
    ],
  }

  const result = parseHeadingToken(token)

  expect(result).toEqual({
    type: "heading_3",
    heading_3: {
      rich_text: [
        {
          type: "text",
          text: { content: "Section" },
          annotations: {},
        },
      ],
    },
  })
})

test("見出しレベル4以上をheading_3に変換", () => {
  const token: Tokens.Heading = {
    type: "heading",
    depth: 4,
    raw: "#### Deep Section",
    text: "Deep Section",
    tokens: [
      {
        type: "text",
        raw: "Deep Section",
        text: "Deep Section",
      } as Tokens.Text,
    ],
  }

  const result = parseHeadingToken(token)

  expect(result).toEqual({
    type: "heading_3",
    heading_3: {
      rich_text: [
        {
          type: "text",
          text: { content: "Deep Section" },
          annotations: {},
        },
      ],
    },
  })
})

test("太字を含む見出しを変換", () => {
  const token: Tokens.Heading = {
    type: "heading",
    depth: 1,
    raw: "# **Bold Title**",
    text: "Bold Title",
    tokens: [
      {
        type: "strong",
        raw: "**Bold Title**",
        text: "Bold Title",
        tokens: [
          {
            type: "text",
            raw: "Bold Title",
            text: "Bold Title",
          } as Tokens.Text,
        ],
      } as Tokens.Strong,
    ],
  }

  const result = parseHeadingToken(token)

  expect(result).toEqual({
    type: "heading_1",
    heading_1: {
      rich_text: [
        {
          type: "text",
          text: { content: "Bold Title" },
          annotations: {
            bold: true,
          },
        },
      ],
    },
  })
})

test("複数のインライン要素を含む見出しを変換", () => {
  const token: Tokens.Heading = {
    type: "heading",
    depth: 2,
    raw: "## **Bold** and *italic*",
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
  }

  const result = parseHeadingToken(token)

  expect(result).toEqual({
    type: "heading_2",
    heading_2: {
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
          text: { content: " and " },
          annotations: {},
        },
        {
          type: "text",
          text: { content: "italic" },
          annotations: {
            italic: true,
          },
        },
      ],
    },
  })
})
