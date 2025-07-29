import type { CustomRichTextItem } from "@/types"

/**
 * Create a rich text item for testing
 */
export function createRichTextItem(
  content: string,
  annotations?: Partial<CustomRichTextItem["annotations"]>,
): CustomRichTextItem {
  return {
    type: "text",
    text: { content },
    annotations: annotations || {},
  }
}
