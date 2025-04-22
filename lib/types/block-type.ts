/**
 * Notionブロックの種類を表現する定数
 */
export const BlockType = {
  Paragraph: "paragraph",
  Heading1: "heading_1",
  Heading2: "heading_2",
  Heading3: "heading_3",
  BulletedListItem: "bulleted_list_item",
  NumberedListItem: "numbered_list_item",
  Code: "code",
  Quote: "quote",
  Divider: "divider",
  Image: "image",
  Title: "title",
} as const

/**
 * Notionブロックの種類の型
 */
export type BlockTypeValue = (typeof BlockType)[keyof typeof BlockType]
