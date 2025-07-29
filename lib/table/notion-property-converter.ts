import type {
  DateRange,
  NotionFile,
  NotionUser,
  Schema,
  SchemaType,
} from "@/types"

export class NotionPropertyConverter {
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

    const typedProperty = property as { multi_select?: Array<{ name: string }> }
    if (!Array.isArray(typedProperty.multi_select)) {
      return []
    }

    return typedProperty.multi_select
      .map((item) => item.name || "")
      .filter(Boolean)
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
      date?: {
        start: string
        end: string | null
      }
    }

    if (!typedProperty.date?.start) {
      return null
    }

    return {
      start: typedProperty.date.start,
      end: typedProperty.date.end,
    }
  }

  private convertPeopleProperty(property: unknown): NotionUser[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as {
      people?: Array<{
        id: string
        name: string
        avatar_url?: string
        person?: { email?: string }
      }>
    }

    if (!Array.isArray(typedProperty.people)) {
      return []
    }

    return typedProperty.people.map((person) => ({
      id: person.id || "",
      name: person.name || "",
      avatar_url: person.avatar_url,
      email: person.person?.email,
    }))
  }

  private convertFilesProperty(property: unknown): NotionFile[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as {
      files?: Array<{
        name: string
        file?: { url: string }
        external?: { url: string }
      }>
    }

    if (!Array.isArray(typedProperty.files)) {
      return []
    }

    return typedProperty.files
      .map((file) => ({
        name: file.name || "",
        url: file.file?.url || file.external?.url || "",
        type: file.file ? ("file" as const) : ("external" as const),
      }))
      .filter((file) => file.url !== "")
  }

  private convertCheckboxProperty(property: unknown): boolean {
    if (!property || typeof property !== "object") {
      return false
    }

    const typedProperty = property as { checkbox?: boolean }
    return !!typedProperty.checkbox
  }

  private convertUrlProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as { url?: string }
    return typedProperty.url || ""
  }

  private convertEmailProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as { email?: string }
    return typedProperty.email || ""
  }

  private convertPhoneNumberProperty(property: unknown): string {
    if (!property || typeof property !== "object") {
      return ""
    }

    const typedProperty = property as { phone_number?: string }
    return typedProperty.phone_number || ""
  }

  private convertRelationProperty(property: unknown): string[] {
    if (!property || typeof property !== "object") {
      return []
    }

    const typedProperty = property as { relation?: Array<{ id: string }> }
    if (!Array.isArray(typedProperty.relation)) {
      return []
    }

    return typedProperty.relation.map((item) => item.id || "").filter(Boolean)
  }

  private convertCreatedTimeProperty(property: unknown): Date | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { created_time?: string }
    if (!typedProperty.created_time) {
      return null
    }

    return new Date(typedProperty.created_time)
  }

  private convertCreatedByProperty(property: unknown): NotionUser | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      created_by?: {
        id: string
        name: string
        avatar_url?: string
      }
    }

    if (!typedProperty.created_by) {
      return null
    }

    return {
      id: typedProperty.created_by.id || "",
      name: typedProperty.created_by.name || "",
      avatar_url: typedProperty.created_by.avatar_url,
    }
  }

  private convertLastEditedTimeProperty(property: unknown): Date | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as { last_edited_time?: string }
    if (!typedProperty.last_edited_time) {
      return null
    }

    return new Date(typedProperty.last_edited_time)
  }

  private convertLastEditedByProperty(property: unknown): NotionUser | null {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      last_edited_by?: {
        id: string
        name: string
        avatar_url?: string
      }
    }

    if (!typedProperty.last_edited_by) {
      return null
    }

    return {
      id: typedProperty.last_edited_by.id || "",
      name: typedProperty.last_edited_by.name || "",
      avatar_url: typedProperty.last_edited_by.avatar_url,
    }
  }

  private convertFormulaProperty(
    property: unknown,
    formulaType: "string" | "number" | "boolean" | "date",
  ): unknown {
    if (!property || typeof property !== "object") {
      return null
    }

    const typedProperty = property as {
      formula?: {
        type: string
        string?: string
        number?: number
        boolean?: boolean
        date?: { start: string; end: string | null }
      }
    }

    if (!typedProperty.formula) {
      return null
    }

    if (formulaType === "string") {
      return typedProperty.formula.string || ""
    }
    if (formulaType === "number") {
      if (typeof typedProperty.formula.number !== "number") {
        return null
      }
      return typedProperty.formula.number
    }
    if (formulaType === "boolean") {
      return !!typedProperty.formula.boolean
    }
    if (formulaType === "date") {
      if (!typedProperty.formula.date?.start) {
        return null
      }
      return {
        start: typedProperty.formula.date.start,
        end: typedProperty.formula.date.end,
      }
    }

    return null
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
    if (typeof value !== "number") {
      return { number: null }
    }
    return { number: value }
  }

  private convertSelectToNotion(value: unknown): Record<string, unknown> {
    if (typeof value !== "string" || value === "") {
      return { select: null }
    }
    return { select: { name: value } }
  }

  private convertMultiSelectToNotion(value: unknown): Record<string, unknown> {
    if (!Array.isArray(value)) {
      return { multi_select: [] }
    }
    return {
      multi_select: value.map((item) => ({ name: String(item) })),
    }
  }

  private convertStatusToNotion(value: unknown): Record<string, unknown> {
    if (typeof value !== "string" || value === "") {
      return { status: null }
    }
    return { status: { name: value } }
  }

  private convertDateToNotion(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && "start" in value) {
      const dateRange = value as DateRange
      return {
        date: {
          start: dateRange.start,
          end: dateRange.end,
        },
      }
    }

    if (value instanceof Date) {
      return {
        date: {
          start: value.toISOString(),
          end: null,
        },
      }
    }

    return { date: null }
  }

  private convertPeopleToNotion(value: unknown): Record<string, unknown> {
    if (!Array.isArray(value)) {
      return { people: [] }
    }
    return {
      people: (value as NotionUser[])
        .filter((user) => user.id)
        .map((user) => ({ id: user.id })),
    }
  }

  private convertFilesToNotion(value: unknown): Record<string, unknown> {
    if (!Array.isArray(value)) {
      return { files: [] }
    }

    return {
      files: (value as NotionFile[]).map((file) => {
        if (file.type === "file") {
          return {
            name: file.name,
            file: { url: file.url },
          }
        }
        return {
          name: file.name,
          external: { url: file.url },
        }
      }),
    }
  }

  private convertCheckboxToNotion(value: unknown): Record<string, unknown> {
    return { checkbox: Boolean(value) }
  }

  private convertUrlToNotion(value: unknown): Record<string, unknown> {
    return { url: String(value || "") }
  }

  private convertEmailToNotion(value: unknown): Record<string, unknown> {
    return { email: String(value || "") }
  }

  private convertPhoneNumberToNotion(value: unknown): Record<string, unknown> {
    return { phone_number: String(value || "") }
  }

  private convertRelationToNotion(value: unknown): Record<string, unknown> {
    if (typeof value === "string" && value !== "") {
      return {
        relation: [{ id: value }],
      }
    }

    if (!Array.isArray(value)) {
      return { relation: [] }
    }

    return {
      relation: (value as string[]).filter((id) => id).map((id) => ({ id })),
    }
  }
}
