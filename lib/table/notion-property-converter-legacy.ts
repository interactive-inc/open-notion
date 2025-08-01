// このファイルは古い実装で、テスト用に残しています
import type {
  DateRange,
  NotionFile,
  NotionUser,
  Schema,
  SchemaType,
} from "@/types"

export class NotionPropertyConverterLegacy {
  fromNotion<T extends Schema>(
    schema: T,
    properties: Record<string, unknown>,
  ): SchemaType<T> {
    const result: Record<string, unknown> = {}

    for (const [key, config] of Object.entries(schema)) {
      const property = properties[key]

      if (!property && config.required) {
        throw new Error(`必須プロパティ ${key} が見つかりません`)
      }

      if (config.type === "title") {
        result[key] = this.convertTitleProperty(property)
        continue
      }
      if (config.type === "rich_text") {
        result[key] = this.convertRichTextProperty(property)
        continue
      }
      if (config.type === "number") {
        result[key] = this.convertNumberProperty(property)
        continue
      }
      if (config.type === "select") {
        result[key] = this.convertSelectProperty(property)
        continue
      }
      if (config.type === "multi_select") {
        result[key] = this.convertMultiSelectProperty(property)
        continue
      }
      if (config.type === "status") {
        result[key] = this.convertStatusProperty(property)
        continue
      }
      if (config.type === "date") {
        result[key] = this.convertDateProperty(property)
        continue
      }
      if (config.type === "people") {
        result[key] = this.convertPeopleProperty(property)
        continue
      }
      if (config.type === "files") {
        result[key] = this.convertFilesProperty(property)
        continue
      }
      if (config.type === "checkbox") {
        result[key] = this.convertCheckboxProperty(property)
        continue
      }
      if (config.type === "url") {
        result[key] = this.convertUrlProperty(property)
        continue
      }
      if (config.type === "email") {
        result[key] = this.convertEmailProperty(property)
        continue
      }
      if (config.type === "phone_number") {
        result[key] = this.convertPhoneNumberProperty(property)
        continue
      }
      if (config.type === "relation") {
        result[key] = this.convertRelationProperty(property)
        continue
      }
      if (config.type === "created_time") {
        result[key] = this.convertCreatedTimeProperty(property)
        continue
      }
      if (config.type === "created_by") {
        result[key] = this.convertCreatedByProperty(property)
        continue
      }
      if (config.type === "last_edited_time") {
        result[key] = this.convertLastEditedTimeProperty(property)
        continue
      }
      if (config.type === "last_edited_by") {
        result[key] = this.convertLastEditedByProperty(property)
        continue
      }
      if (config.type === "formula") {
        result[key] = this.convertFormulaProperty(property, config.formulaType)
      }
    }

    return result as SchemaType<T>
  }

  toNotion<T extends Schema>(
    schema: T,
    data: Partial<SchemaType<T>>,
  ): Record<string, unknown> {
    const properties: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue
      }

      const config = schema[key]
      if (!config) {
        continue
      }

      if (config.type === "title") {
        properties[key] = this.convertTitleToNotion(value)
        continue
      }
      if (config.type === "rich_text") {
        properties[key] = this.convertRichTextToNotion(value)
        continue
      }
      if (config.type === "number") {
        properties[key] = this.convertNumberToNotion(value)
        continue
      }
      if (config.type === "select") {
        properties[key] = this.convertSelectToNotion(value)
        continue
      }
      if (config.type === "multi_select") {
        properties[key] = this.convertMultiSelectToNotion(value)
        continue
      }
      if (config.type === "status") {
        properties[key] = this.convertStatusToNotion(value)
        continue
      }
      if (config.type === "date") {
        properties[key] = this.convertDateToNotion(value)
        continue
      }
      if (config.type === "people") {
        properties[key] = this.convertPeopleToNotion(value)
        continue
      }
      if (config.type === "files") {
        properties[key] = this.convertFilesToNotion(value)
        continue
      }
      if (config.type === "checkbox") {
        properties[key] = this.convertCheckboxToNotion(value)
        continue
      }
      if (config.type === "url") {
        properties[key] = this.convertUrlToNotion(value)
        continue
      }
      if (config.type === "email") {
        properties[key] = this.convertEmailToNotion(value)
        continue
      }
      if (config.type === "phone_number") {
        properties[key] = this.convertPhoneNumberToNotion(value)
        continue
      }
      if (config.type === "relation") {
        properties[key] = this.convertRelationToNotion(value)
      }
    }

    return properties
  }

  private convertTitleToNotion(value: unknown): Record<string, unknown> {
    return {
      title: [{ type: "text", text: { content: String(value || "") } }],
    }
  }

  private convertRichTextToNotion(value: unknown): Record<string, unknown> {
    return {
      rich_text: [{ type: "text", text: { content: String(value || "") } }],
    }
  }

  private convertNumberToNotion(value: unknown): Record<string, unknown> {
    return {
      number: typeof value === "number" ? value : null,
    }
  }

  private convertSelectToNotion(value: unknown): Record<string, unknown> {
    return {
      select: value ? { name: String(value) } : null,
    }
  }

  private convertMultiSelectToNotion(value: unknown): Record<string, unknown> {
    const values = Array.isArray(value) ? value : value ? [value] : []
    return {
      multi_select: values.map((v) => ({ name: String(v) })),
    }
  }

  private convertStatusToNotion(value: unknown): Record<string, unknown> {
    return {
      status: value ? { name: String(value) } : null,
    }
  }

  private convertDateToNotion(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object") {
      return { date: null }
    }

    const dateValue = value as { start?: string; end?: string | null }
    if (!dateValue.start) {
      return { date: null }
    }

    return {
      date: {
        start: dateValue.start,
        ...(dateValue.end !== undefined && { end: dateValue.end }),
      },
    }
  }

  private convertPeopleToNotion(value: unknown): Record<string, unknown> {
    const users = Array.isArray(value) ? value : []
    return {
      people: users
        .filter(
          (user): user is { id: string } =>
            typeof user === "object" && user !== null && "id" in user,
        )
        .map((user) => ({ id: user.id })),
    }
  }

  private convertFilesToNotion(value: unknown): Record<string, unknown> {
    const files = Array.isArray(value) ? value : []
    return {
      files: files.filter(
        (file): file is NotionFile => typeof file === "object" && file !== null,
      ),
    }
  }

  private convertCheckboxToNotion(value: unknown): Record<string, unknown> {
    return {
      checkbox: Boolean(value),
    }
  }

  private convertUrlToNotion(value: unknown): Record<string, unknown> {
    return {
      url: value ? String(value) : "",
    }
  }

  private convertEmailToNotion(value: unknown): Record<string, unknown> {
    return {
      email: value ? String(value) : null,
    }
  }

  private convertPhoneNumberToNotion(value: unknown): Record<string, unknown> {
    return {
      phone_number: value ? String(value) : null,
    }
  }

  private convertRelationToNotion(value: unknown): Record<string, unknown> {
    const ids = Array.isArray(value) ? value : []
    return {
      relation: ids.map((id) => ({ id: String(id) })),
    }
  }

  private convertTitleProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as { title?: Array<{ plain_text: string }> }
    if (!Array.isArray(typedProperty.title)) {
      return ""
    }

    return typedProperty.title.map((item) => item.plain_text || "").join("")
  }

  private convertRichTextProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as {
      rich_text?: Array<{ plain_text: string }>
    }
    if (!Array.isArray(typedProperty.rich_text)) {
      return ""
    }

    return typedProperty.rich_text.map((item) => item.plain_text || "").join("")
  }

  private convertNumberProperty(property: unknown): number | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { number?: number }
    if (typeof typedProperty.number !== "number") {
      return null
    }

    return typedProperty.number
  }

  private convertSelectProperty(property: unknown): string | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { select?: { name: string } }
    return typedProperty.select?.name || null
  }

  private convertMultiSelectProperty(property: unknown): string[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as {
      multi_select?: Array<{ name: string }>
    }
    if (!Array.isArray(typedProperty.multi_select)) {
      return []
    }

    return typedProperty.multi_select.map((item) => item.name)
  }

  private convertStatusProperty(property: unknown): string | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { status?: { name: string } }
    return typedProperty.status?.name || null
  }

  private convertDateProperty(property: unknown): DateRange | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      date?: { start: string; end: string | null; time_zone?: string | null }
    }
    if (!typedProperty.date) {
      return null
    }

    return {
      start: typedProperty.date.start,
      end: typedProperty.date.end,
      timeZone: typedProperty.date.time_zone || undefined,
    }
  }

  private convertPeopleProperty(property: unknown): NotionUser[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as {
      people?: Array<{
        id: string
        name?: string
        avatar_url?: string
        email?: string
      }>
    }
    if (!Array.isArray(typedProperty.people)) {
      return []
    }

    return typedProperty.people.map((user) => ({
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      email: user.email,
    }))
  }

  private convertFilesProperty(property: unknown): NotionFile[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as {
      files?: Array<{
        name: string
        type: "file" | "external"
        file?: { url: string }
        external?: { url: string }
      }>
    }
    if (!Array.isArray(typedProperty.files)) {
      return []
    }

    return typedProperty.files.map((file) => ({
      name: file.name,
      url:
        file.type === "file" ? file.file?.url || "" : file.external?.url || "",
      type: file.type,
    }))
  }

  private convertCheckboxProperty(property: unknown): boolean {
    if (!property || typeof property !== "object") {
      return false
    }

    const typedProperty = property as { checkbox?: boolean }
    return typedProperty.checkbox || false
  }

  private convertUrlProperty(property: unknown): string | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { url?: string }
    return typedProperty.url || null
  }

  private convertEmailProperty(property: unknown): string | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { email?: string }
    return typedProperty.email || null
  }

  private convertPhoneNumberProperty(property: unknown): string | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { phone_number?: string }
    return typedProperty.phone_number || null
  }

  private convertRelationProperty(property: unknown): string[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as {
      relation?: Array<{ id: string }>
    }
    if (!Array.isArray(typedProperty.relation)) {
      return []
    }

    return typedProperty.relation.map((relation) => relation.id)
  }

  private convertCreatedTimeProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as { created_time?: string }
    return typedProperty.created_time || ""
  }

  private convertCreatedByProperty(property: unknown): NotionUser | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      created_by?: {
        id: string
        name?: string
        avatar_url?: string
        email?: string
      }
    }
    if (!typedProperty.created_by) {
      return null
    }

    return {
      id: typedProperty.created_by.id,
      name: typedProperty.created_by.name,
      avatar_url: typedProperty.created_by.avatar_url,
      email: typedProperty.created_by.email,
    }
  }

  private convertLastEditedTimeProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as { last_edited_time?: string }
    return typedProperty.last_edited_time || ""
  }

  private convertLastEditedByProperty(property: unknown): NotionUser | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      last_edited_by?: {
        id: string
        name?: string
        avatar_url?: string
        email?: string
      }
    }
    if (!typedProperty.last_edited_by) {
      return null
    }

    return {
      id: typedProperty.last_edited_by.id,
      name: typedProperty.last_edited_by.name,
      avatar_url: typedProperty.last_edited_by.avatar_url,
      email: typedProperty.last_edited_by.email,
    }
  }

  private convertFormulaProperty(
    property: unknown,
    type?: string,
  ): string | number | boolean | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      formula?: {
        type: string
        string?: string
        number?: number
        boolean?: boolean
      }
    }
    if (!typedProperty.formula) {
      return null
    }

    if (type === "string") {
      return typedProperty.formula.string || null
    }
    if (type === "number") {
      return typedProperty.formula.number ?? null
    }
    if (type === "boolean") {
      return typedProperty.formula.boolean ?? null
    }

    switch (typedProperty.formula.type) {
      case "string":
        return typedProperty.formula.string || null
      case "number":
        return typedProperty.formula.number ?? null
      case "boolean":
        return typedProperty.formula.boolean ?? null
      default:
        return null
    }
  }
}
