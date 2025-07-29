import { expect, test } from "bun:test"
import type { Tokens } from "marked"
import { parseCodeToken } from "./parse-code-token"

test("シンプルなコードブロックを変換", () => {
  const token: Tokens.Code = {
    type: "code",
    raw: "```\nconsole.log('hello');\n```",
    lang: undefined,
    text: "console.log('hello');",
  }

  const result = parseCodeToken(token)

  expect(result).toEqual({
    type: "code",
    code: {
      language: "plain text",
      rich_text: [
        {
          type: "text",
          text: { content: "console.log('hello');" },
          annotations: {},
        },
      ],
    },
  })
})

test("言語指定付きコードブロックを変換", () => {
  const token: Tokens.Code = {
    type: "code",
    raw: "```javascript\nconst x = 10;\n```",
    lang: "javascript",
    text: "const x = 10;",
  }

  const result = parseCodeToken(token)

  expect(result).toEqual({
    type: "code",
    code: {
      language: "javascript",
      rich_text: [
        {
          type: "text",
          text: { content: "const x = 10;" },
          annotations: {},
        },
      ],
    },
  })
})

test("複数行のコードブロックを変換", () => {
  const token: Tokens.Code = {
    type: "code",
    raw: "```python\ndef hello():\n    print('Hello, World!')\n\nhello()\n```",
    lang: "python",
    text: "def hello():\n    print('Hello, World!')\n\nhello()",
  }

  const result = parseCodeToken(token)

  expect(result).toEqual({
    type: "code",
    code: {
      language: "python",
      rich_text: [
        {
          type: "text",
          text: {
            content: "def hello():\n    print('Hello, World!')\n\nhello()",
          },
          annotations: {},
        },
      ],
    },
  })
})

test("空のコードブロックを変換", () => {
  const token: Tokens.Code = {
    type: "code",
    raw: "```\n```",
    lang: undefined,
    text: "",
  }

  const result = parseCodeToken(token)

  expect(result).toEqual({
    type: "code",
    code: {
      language: "plain text",
      rich_text: [
        {
          type: "text",
          text: { content: "" },
          annotations: {},
        },
      ],
    },
  })
})

test("特殊文字を含むコードブロックを変換", () => {
  const token: Tokens.Code = {
    type: "code",
    raw: '```html\n<div class="test">&nbsp;</div>\n```',
    lang: "html",
    text: '<div class="test">&nbsp;</div>',
  }

  const result = parseCodeToken(token)

  expect(result).toEqual({
    type: "code",
    code: {
      language: "html",
      rich_text: [
        {
          type: "text",
          text: { content: '<div class="test">&nbsp;</div>' },
          annotations: {},
        },
      ],
    },
  })
})
