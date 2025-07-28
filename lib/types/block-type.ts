/**
 * Notion block type constants
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
 * Notion block type union
 */
export type BlockTypeValue = (typeof BlockType)[keyof typeof BlockType]
