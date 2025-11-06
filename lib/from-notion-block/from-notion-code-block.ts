import type { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionRichTextItem } from "@/utils"

export function fromNotionCodeBlock(block: CodeBlockObjectResponse): string {
  const language = block.code.language || ""

  const code = fromNotionRichTextItem(block.code.rich_text)

  return `\`\`\`${language}\n${code}\n\`\`\``.trim()
}
