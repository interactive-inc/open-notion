import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionProperties } from "@/from-notion-property/from-notion-properties"
import { toNotionProperties } from "@/to-notion-property/to-notion-properties"
import type { Schema, SchemaType } from "@/types"

export class NotionPropertyConverter {
  fromNotion<T extends Schema>(
    schema: T,
    properties: PageObjectResponse["properties"],
  ): SchemaType<T> {
    return fromNotionProperties(schema, properties)
  }

  toNotion<T extends Schema>(schema: T, data: Partial<SchemaType<T>>) {
    return toNotionProperties(schema, data)
  }
}
