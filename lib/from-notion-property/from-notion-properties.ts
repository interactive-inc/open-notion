import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { Schema, SchemaType } from "@/types"
import { fromNotionProperty } from "./from-notion-property"

/**
 * Notionのプロパティをスキーマに基づいて変換
 */
export function fromNotionProperties<T extends Schema>(
  schema: T,
  properties: PageObjectResponse["properties"],
): SchemaType<T> {
  const result: Record<string, unknown> = {}

  for (const [key, config] of Object.entries(schema)) {
    const property = properties[key]

    if (!property) {
      result[key] = null
      continue
    }

    // プロパティタイプが一致するか確認
    if (property.type !== config.type) {
      throw new Error(
        `プロパティ ${key} の型が一致しません。期待: ${config.type}, 実際: ${property.type}`,
      )
    }

    result[key] = fromNotionProperty(property)
  }

  return result as SchemaType<T>
}
