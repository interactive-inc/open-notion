import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { fromNotionCheckboxProperty } from "./from-notion-checkbox-property"
import { fromNotionDateProperty } from "./from-notion-date-property"
import { fromNotionMultiSelectProperty } from "./from-notion-multi-select-property"
import { fromNotionNumberProperty } from "./from-notion-number-property"
import { fromNotionRichTextProperty } from "./from-notion-rich-text-property"
import { fromNotionSelectProperty } from "./from-notion-select-property"
import { fromNotionTitleProperty } from "./from-notion-title-property"

type NotionProperty = PageObjectResponse["properties"][string]

/**
 * Notionのプロパティを適切な型に変換
 */
export function fromNotionProperty(property: NotionProperty): unknown {
  if (property.type === "title") {
    return fromNotionTitleProperty(property)
  }

  if (property.type === "rich_text") {
    return fromNotionRichTextProperty(property)
  }

  if (property.type === "number") {
    return fromNotionNumberProperty(property)
  }

  if (property.type === "checkbox") {
    return fromNotionCheckboxProperty(property)
  }

  if (property.type === "select") {
    return fromNotionSelectProperty(property)
  }

  if (property.type === "multi_select") {
    return fromNotionMultiSelectProperty(property)
  }

  if (property.type === "date") {
    return fromNotionDateProperty(property)
  }

  if (property.type === "email") {
    return property.email
  }

  if (property.type === "phone_number") {
    return property.phone_number
  }

  if (property.type === "url") {
    return property.url
  }

  if (property.type === "created_time") {
    return property.created_time
  }

  if (property.type === "last_edited_time") {
    return property.last_edited_time
  }

  if (property.type === "created_by") {
    return property.created_by
  }

  if (property.type === "last_edited_by") {
    return property.last_edited_by
  }

  if (property.type === "status") {
    return property.status?.name || null
  }

  if (property.type === "files") {
    return property.files
  }

  if (property.type === "people") {
    return property.people
  }

  if (property.type === "relation") {
    return property.relation
  }

  if (property.type === "rollup") {
    return property.rollup
  }

  if (property.type === "formula") {
    return property.formula
  }

  if (property.type === "button") {
    return property.button
  }

  if (property.type === "unique_id") {
    return property.unique_id
  }

  if (property.type === "verification") {
    return property.verification
  }

  return null
}
