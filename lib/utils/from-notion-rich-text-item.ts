import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

/**
 * Notionのリッチテキストをマークダウンテキストに変換する
 * @param richTexts リッチテキスト配列
 * @returns マークダウンテキスト
 */
export function fromNotionRichTextItem(
  richTexts: RichTextItemResponse[],
): string {
  if (!richTexts || richTexts.length === 0) return ""

  let result = ""

  for (const text of richTexts) {
    let textResult = text.plain_text

    if (text.annotations) {
      if (text.annotations.bold) textResult = `**${textResult}**`
      if (text.annotations.italic) textResult = `*${textResult}*`
      if (text.annotations.strikethrough) textResult = `~~${textResult}~~`
      if (text.annotations.code) textResult = `\`${textResult}\``
    }

    if (text.href) {
      textResult = `[${textResult}](${text.href})`
    }

    result += textResult
  }

  return result
}
