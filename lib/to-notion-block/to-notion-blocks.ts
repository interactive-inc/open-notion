import type {
  BlockObjectRequest,
  BlockObjectRequestWithoutChildren,
} from "@notionhq/client/build/src/api-endpoints"
import { type Tokens, lexer } from "marked"
import { BlockType } from "../types/block-type"
import type { CustomRichTextItem } from "../types/custom-rich-text-item"

export function toNotionBlocks(markdown: string): BlockObjectRequest[] {
  const tokenList = lexer(markdown)

  const blocks: BlockObjectRequest[] = []

  for (const token of tokenList) {
    if (token.type === "heading") {
      const t = token as Tokens.Heading
      blocks.push(parseHeadingToken(t))
    }

    if (token.type === "list") {
      const t = token as Tokens.List
      const objects = parseListToken(t)
      for (const node of objects) {
        blocks.push(node)
      }
    }

    if (token.type === "code") {
      const t = token as Tokens.Code
      blocks.push(parseCodeToken(t))
    }

    if (token.type === "paragraph") {
      const t = token as Tokens.Paragraph
      blocks.push(parseParagraphToken(t))
    }
  }

  return blocks
}

function parseListToken(token: Tokens.List): BlockObjectRequest[] {
  return token.items.map((item) => {
    if (token.ordered) {
      return parseNumberedListItemToken(item)
    }

    return parseBulletedListItemToken(item)
  })
}

function parseBulletedListItemToken(item: Tokens.ListItem): BlockObjectRequest {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  const itemListToken = item.tokens.find((t) => {
    return t.type === "list"
  })

  const listToken = itemListToken as Tokens.List

  const children = listToken?.items.map((item) => {
    return listToken.ordered
      ? parseNestedNumberedListItemToken(item)
      : parseNestedBulletedListItemToken(item)
  })

  return {
    type: BlockType.BulletedListItem,
    bulleted_list_item: {
      rich_text: [parseInlineToken(textToken)],
      children: children as never,
    },
  }
}

function parseNumberedListItemToken(item: Tokens.ListItem): BlockObjectRequest {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  const itemListToken = item.tokens.find((t) => {
    return t.type === "list"
  })

  const listToken = itemListToken as Tokens.List

  const children = listToken?.items.map((item) => {
    return listToken.ordered
      ? parseNestedNumberedListItemToken(item)
      : parseNestedBulletedListItemToken(item)
  })

  return {
    type: BlockType.NumberedListItem,
    numbered_list_item: {
      rich_text: [parseInlineToken(textToken)],
      children: children as never,
    },
  }
}

function parseNestedBulletedListItemToken(item: Tokens.ListItem) {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  const itemListToken = item.tokens.find((t) => {
    return t.type === "list"
  })

  const listToken = itemListToken as Tokens.List

  const children = listToken?.items.map((item) => {
    return listToken.ordered
      ? parseLastNumberedListItem(item)
      : parseLastBulletedListItem(item)
  })

  return {
    type: BlockType.BulletedListItem,
    bulleted_list_item: {
      rich_text: [parseInlineToken(textToken)],
      children: children,
    },
  }
}

function parseNestedNumberedListItemToken(
  item: Tokens.ListItem,
): BlockObjectRequest {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  const itemListToken = item.tokens.find((t) => {
    return t.type === "list"
  })

  const listToken = itemListToken as Tokens.List

  const children = listToken?.items.map((item) => {
    return listToken.ordered
      ? parseLastNumberedListItem(item)
      : parseLastBulletedListItem(item)
  })

  return {
    type: BlockType.NumberedListItem,
    numbered_list_item: {
      rich_text: [parseInlineToken(textToken)],
      children: children,
    },
  }
}

function parseLastBulletedListItem(
  item: Tokens.ListItem,
): BlockObjectRequestWithoutChildren {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  return {
    type: BlockType.BulletedListItem,
    bulleted_list_item: {
      rich_text: [parseInlineToken(textToken)],
    },
  }
}

function parseLastNumberedListItem(
  item: Tokens.ListItem,
): BlockObjectRequestWithoutChildren {
  const itemToken = item.tokens.find((t) => t.type === "text")

  if (itemToken === undefined) {
    throw new Error("Text token not found in list item")
  }

  const textToken = itemToken as Tokens.Text

  return {
    type: BlockType.NumberedListItem,
    numbered_list_item: {
      rich_text: [parseInlineToken(textToken)],
    },
  }
}

function parseHeadingToken(markedToken: Tokens.Heading): BlockObjectRequest {
  if (markedToken.depth === 2) {
    return {
      type: BlockType.Heading2,
      heading_2: {
        rich_text: markedToken.tokens.map(parseInlineToken),
      },
    } as const
  }

  if (markedToken.depth === 3) {
    return {
      type: BlockType.Heading3,
      heading_3: {
        rich_text: markedToken.tokens.map(parseInlineToken),
      },
    } as const
  }

  return {
    type: BlockType.Heading1,
    heading_1: {
      rich_text: markedToken.tokens.map(parseInlineToken),
    },
  } as const
}

function parseCodeToken(token: Tokens.Code): BlockObjectRequest {
  return {
    type: BlockType.Code,
    code: {
      rich_text: [parseInlineToken(token)],
      language: "plain text" as const,
    },
  } as const
}

function parseParagraphToken(token: Tokens.Paragraph): BlockObjectRequest {
  return {
    type: BlockType.Paragraph,
    paragraph: {
      rich_text: token.tokens.map(parseInlineToken),
    },
  } as const
}

function parseInlineToken(token: Tokens.Generic): CustomRichTextItem {
  if (token.type === "strong") {
    return {
      type: "text",
      text: {
        content: token.text,
      },
      annotations: {
        bold: true,
      },
    }
  }

  if (token.type === "em") {
    return {
      type: "text",
      text: {
        content: token.text,
      },
      annotations: {
        italic: true,
      },
    }
  }

  if (token.type === "codespan") {
    return {
      type: "text",
      text: {
        content: token.text,
      },
      annotations: {
        code: true,
      },
    }
  }

  return {
    type: "text",
    text: {
      content: token.text,
    },
    annotations: {},
  }
}
