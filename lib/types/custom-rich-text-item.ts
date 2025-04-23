export type CustomRichTextItem = {
  text: {
    content: string
  }
  type: "text"
  annotations?: {
    bold?: boolean
    italic?: boolean
    code?: boolean
    strikethrough?: boolean
  }
}
