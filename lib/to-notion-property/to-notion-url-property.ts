import { z } from "zod"
import type { NotionUrlPropertyRequest } from "@/types"

const urlPropertySchema = z.string().nullable()

/**
 * unknownをNotionのurlプロパティに変換
 * nullは許可、それ以外でstringでない場合はエラー
 */
export function toNotionUrlProperty(value: unknown): NotionUrlPropertyRequest {
  const data = urlPropertySchema.parse(value)

  return {
    url: data && data.length > 0 ? data : null,
  }
}
