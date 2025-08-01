import type { RichTextItemRequest, RichTextItemResponse } from "@/types"

/**
 * Create a rich text item for testing
 */
export function createRichTextItem(
  content: string,
  annotations?: Partial<RichTextItemRequest["annotations"]>,
): RichTextItemResponse {
  return {
    type: "text",
    text: { content },
    plain_text: content,
    annotations: annotations || {},
  }
}
