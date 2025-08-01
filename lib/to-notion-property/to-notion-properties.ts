import type { NotionPropertyRequest, Schema, SchemaType } from "@/types"
import { toNotionProperty } from "./to-notion-property"

/**
 * スキーマに基づいてオブジェクトをNotionプロパティに変換
 */
export function toNotionProperties<T extends Schema>(
  schema: T,
  data: Partial<SchemaType<T>>,
): Record<string, NotionPropertyRequest> {
  const properties: Record<string, NotionPropertyRequest> = {}

  for (const [key, config] of Object.entries(schema)) {
    const value = data[key as keyof SchemaType<T>]

    if (value === undefined) {
      continue
    }

    properties[key] = toNotionProperty(config, value)
  }

  return properties
}
