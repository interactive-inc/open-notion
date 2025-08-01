import type { NotionPropertyRequest, PropertyConfig } from "@/types"
import { toNotionCheckboxProperty } from "./to-notion-checkbox-property"
import { toNotionDateProperty } from "./to-notion-date-property"
import { toNotionEmailProperty } from "./to-notion-email-property"
import { toNotionMultiSelectProperty } from "./to-notion-multi-select-property"
import { toNotionNumberProperty } from "./to-notion-number-property"
import { toNotionPeopleProperty } from "./to-notion-people-property"
import { toNotionPhoneNumberProperty } from "./to-notion-phone-number-property"
import { toNotionRelationProperty } from "./to-notion-relation-property"
import { toNotionRichTextProperty } from "./to-notion-rich-text-property"
import { toNotionSelectProperty } from "./to-notion-select-property"
import { toNotionTitleProperty } from "./to-notion-title-property"
import { toNotionUrlProperty } from "./to-notion-url-property"

/**
 * 値をNotionプロパティ形式に変換
 */
export function toNotionProperty<T extends PropertyConfig>(
  config: T,
  value: unknown,
): NotionPropertyRequest {
  if (config.type === "title") {
    return toNotionTitleProperty(value)
  }

  if (config.type === "rich_text") {
    return toNotionRichTextProperty(value)
  }

  if (config.type === "number") {
    return toNotionNumberProperty(value)
  }

  if (config.type === "checkbox") {
    return toNotionCheckboxProperty(value)
  }

  if (config.type === "select") {
    return toNotionSelectProperty(value)
  }

  if (config.type === "multi_select") {
    return toNotionMultiSelectProperty(value)
  }

  if (config.type === "date") {
    return toNotionDateProperty(value)
  }

  if (config.type === "url") {
    return toNotionUrlProperty(value)
  }

  if (config.type === "email") {
    return toNotionEmailProperty(value)
  }

  if (config.type === "phone_number") {
    return toNotionPhoneNumberProperty(value)
  }

  if (config.type === "relation") {
    return toNotionRelationProperty(value)
  }

  if (config.type === "people") {
    return toNotionPeopleProperty(value)
  }

  if (config.type === "status") {
    return toNotionSelectProperty(value)
  }

  throw new Error(`Unknown property type: ${(config as PropertyConfig).type}`)
}
