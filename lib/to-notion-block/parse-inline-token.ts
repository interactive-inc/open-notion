import type { Tokens } from "marked"
import type { CustomRichTextItem } from "@/types"

/**
 * Convert inline token to Notion rich text item
 */
export function parseInlineToken(token: Tokens.Generic): CustomRichTextItem {
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

  if (token.type === "del") {
    return {
      type: "text",
      text: {
        content: token.text,
      },
      annotations: {
        strikethrough: true,
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
