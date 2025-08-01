import { z } from "zod"
import type { NotionDatePropertyRequest } from "@/types"

const datePropertySchema = z
  .object({
    start: z.string().min(1),
    end: z.string().optional(),
  })
  .nullable()

/**
 * unknownをNotionのdateプロパティに変換
 * nullは許可、それ以外で適切なオブジェクト構造でない場合はエラー
 */
export function toNotionDateProperty(
  value: unknown,
): NotionDatePropertyRequest {
  const data = datePropertySchema.parse(value)

  if (data === null) {
    return { date: null }
  }

  return {
    date: {
      start: data.start,
      end: data.end && data.end.length > 0 ? data.end : null,
      time_zone: null,
    },
  }
}
