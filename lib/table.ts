import type { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { toNotionBlocks } from "./to-notion-block/to-notion-blocks"

/* Notionのページオブジェクトの型定義 */
export type NotionPage = {
  id: string
  url: string
  created_time: string
  last_edited_time: string
  archived: boolean
  properties: Record<string, unknown>
}

/* Notionの基本データ型 */
export type NotionPropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "status"
  | "date"
  | "people"
  | "files"
  | "checkbox"
  | "url"
  | "email"
  | "phone_number"
  | "relation"
  | "created_time"
  | "created_by"
  | "last_edited_time"
  | "last_edited_by"

/* Notionユーザー型 */
export type NotionUser = {
  id: string
  name?: string
  avatar_url?: string
  email?: string
}

/* Notionファイル型 */
export type NotionFile = {
  name: string
  url: string
  type: "file" | "external"
}

/* 日付範囲型 */
export type DateRange = {
  start: string
  end: string | null
}

/* プロパティの共通設定情報 */
type BasePropertyConfig = {
  required?: boolean
}

/* タイトルプロパティ */
type TitlePropertyConfig = BasePropertyConfig & {
  type: "title"
}

/* リッチテキストプロパティ */
type RichTextPropertyConfig = BasePropertyConfig & {
  type: "rich_text"
}

/* 数値プロパティ */
type NumberPropertyConfig = BasePropertyConfig & {
  type: "number"
  format?:
    | "number"
    | "number_with_commas"
    | "percent"
    | "dollar"
    | "euro"
    | "pound"
    | "yen"
    | "ruble"
    | "rupee"
    | "won"
    | "yuan"
}

/* 選択肢プロパティ */
type SelectPropertyConfig = BasePropertyConfig & {
  type: "select"
  options: string[]
}

/* 複数選択プロパティ */
type MultiSelectPropertyConfig = BasePropertyConfig & {
  type: "multi_select"
  options: string[] | null // nullの場合は任意の値を許容
}

/* ステータスプロパティ */
type StatusPropertyConfig = BasePropertyConfig & {
  type: "status"
  options: string[]
}

/* 日付プロパティ */
type DatePropertyConfig = BasePropertyConfig & {
  type: "date"
}

/* 人物プロパティ */
type PeoplePropertyConfig = BasePropertyConfig & {
  type: "people"
}

/* ファイルプロパティ */
type FilesPropertyConfig = BasePropertyConfig & {
  type: "files"
}

/* チェックボックスプロパティ */
type CheckboxPropertyConfig = BasePropertyConfig & {
  type: "checkbox"
}

/* URLプロパティ */
type UrlPropertyConfig = BasePropertyConfig & {
  type: "url"
}

/* メールプロパティ */
type EmailPropertyConfig = BasePropertyConfig & {
  type: "email"
}

/* 電話番号プロパティ */
type PhoneNumberPropertyConfig = BasePropertyConfig & {
  type: "phone_number"
}

/* リレーションプロパティ */
type RelationPropertyConfig = BasePropertyConfig & {
  type: "relation"
  database_id: string
  single_property?: boolean
}

/* 作成日時プロパティ */
type CreatedTimePropertyConfig = BasePropertyConfig & {
  type: "created_time"
}

/* 作成者プロパティ */
type CreatedByPropertyConfig = BasePropertyConfig & {
  type: "created_by"
}

/* 最終編集日時プロパティ */
type LastEditedTimePropertyConfig = BasePropertyConfig & {
  type: "last_edited_time"
}

/* 最終編集者プロパティ */
type LastEditedByPropertyConfig = BasePropertyConfig & {
  type: "last_edited_by"
}

/* すべてのプロパティ設定を合わせた型 */
export type PropertyConfig =
  | TitlePropertyConfig
  | RichTextPropertyConfig
  | NumberPropertyConfig
  | SelectPropertyConfig
  | MultiSelectPropertyConfig
  | StatusPropertyConfig
  | DatePropertyConfig
  | PeoplePropertyConfig
  | FilesPropertyConfig
  | CheckboxPropertyConfig
  | UrlPropertyConfig
  | EmailPropertyConfig
  | PhoneNumberPropertyConfig
  | RelationPropertyConfig
  | CreatedTimePropertyConfig
  | CreatedByPropertyConfig
  | LastEditedTimePropertyConfig
  | LastEditedByPropertyConfig

/* データベーススキーマの定義 */
export type Schema = Record<string, PropertyConfig>

/* スキーマから型を生成するための型マッピング */
type PropertyTypeMapping<T extends PropertyConfig> =
  T extends TitlePropertyConfig
    ? string
    : T extends RichTextPropertyConfig
      ? string
      : T extends NumberPropertyConfig
        ? number
        : T extends SelectPropertyConfig
          ? T["options"][number]
          : T extends MultiSelectPropertyConfig
            ? T["options"] extends null
              ? string[]
              : T["options"] extends string[]
                ? T["options"][number][]
                : string[]
            : T extends StatusPropertyConfig
              ? T["options"][number]
              : T extends DatePropertyConfig
                ? DateRange
                : T extends PeoplePropertyConfig
                  ? NotionUser[]
                  : T extends FilesPropertyConfig
                    ? NotionFile[]
                    : T extends CheckboxPropertyConfig
                      ? boolean
                      : T extends UrlPropertyConfig
                        ? string
                        : T extends EmailPropertyConfig
                          ? string
                          : T extends PhoneNumberPropertyConfig
                            ? string
                            : T extends RelationPropertyConfig
                              ? string[]
                              : T extends CreatedTimePropertyConfig
                                ? Date
                                : T extends CreatedByPropertyConfig
                                  ? NotionUser
                                  : T extends LastEditedTimePropertyConfig
                                    ? Date
                                    : T extends LastEditedByPropertyConfig
                                      ? NotionUser
                                      : never

/* スキーマから型を生成 */
export type SchemaType<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true }
    ? PropertyTypeMapping<T[K]>
    : PropertyTypeMapping<T[K]> | null | undefined
}

/* レコード型定義 */
export type TableRecord<T> = T & {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

/* ソートオプションの型 */
export type SortOption<T extends Schema> = {
  field: keyof SchemaType<T>
  direction: "asc" | "desc"
}

/* 必須フィールドのキーを取得する型 */
type RequiredKeys<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T] &
  keyof SchemaType<T>

/* 必須フィールドの型 */
type RequiredFields<T extends Schema> = {
  [K in RequiredKeys<T>]: SchemaType<T>[K]
}

/* テーブル作成オプション */
export type TableOptions<T extends Schema> = {
  notion: Client
  tableId: string
  schema: T
}

/* クエリオプション型を拡張 */
export type FindOptions<T extends Schema> = {
  where?: WhereCondition<T>
  count?: number // 取得する最大レコード数（最大1024件まで）
  sorts?: SortOption<T> | SortOption<T>[]
}

/* updateMany用のオプション型 */
export type UpdateManyOptions<T extends Schema> = {
  where?: WhereCondition<T>
  update: Partial<SchemaType<T>>
  count?: number // 最大処理件数
}

/* upsert用のオプション型 */
export type UpsertOptions<T extends Schema> = {
  where: WhereCondition<T>
  insert: Partial<SchemaType<T>> & RequiredFields<T> // 必須フィールドを含む
  update: Partial<SchemaType<T>>
}

/* クエリ結果型 */
export type QueryResult<T> = {
  records: TableRecord<T>[]
  cursor: string | null
  hasMore: boolean
}

/* フィルター条件の型 */
export type WhereCondition<T extends Schema> = Partial<{
  [K in keyof SchemaType<T>]: unknown
}>

/* 型を絞り込むユーティリティ関数 */
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/* タイトルプロパティの処理 */
function convertTitleProperty(property: unknown): string {
  if (!property || typeof property !== "object") {
    return ""
  }

  const typedProperty = property as { title?: Array<{ plain_text: string }> }

  if (!Array.isArray(typedProperty.title)) {
    return ""
  }

  return typedProperty.title.map((item) => item.plain_text || "").join("")
}

/* リッチテキストプロパティの処理 */
function convertRichTextProperty(property: unknown): string {
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

/* 数値プロパティの処理 */
function convertNumberProperty(property: unknown): number | null {
  if (!property || typeof property !== "object") {
    return null
  }

  const typedProperty = property as { number?: number }
  return typeof typedProperty.number === "number" ? typedProperty.number : null
}

/* 選択肢プロパティの処理 */
function convertSelectProperty(property: unknown): string | null {
  if (!property || typeof property !== "object") {
    return null
  }

  const typedProperty = property as { select?: { name: string } }
  return typedProperty.select?.name || null
}

/* 複数選択プロパティの処理 */
function convertMultiSelectProperty(property: unknown): string[] {
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

/* ステータスプロパティの処理 */
function convertStatusProperty(property: unknown): string | null {
  if (!property || typeof property !== "object") {
    return null
  }

  const typedProperty = property as { status?: { name: string } }
  return typedProperty.status?.name || null
}

/* 日付プロパティの処理 */
function convertDateProperty(property: unknown): DateRange | null {
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

/* 人物プロパティの処理 */
function convertPeopleProperty(property: unknown): NotionUser[] {
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

/* ファイルプロパティの処理 */
function convertFilesProperty(property: unknown): NotionFile[] {
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

/* チェックボックスプロパティの処理 */
function convertCheckboxProperty(property: unknown): boolean {
  if (!property || typeof property !== "object") {
    return false
  }

  const typedProperty = property as { checkbox?: boolean }
  return !!typedProperty.checkbox
}

/* URLプロパティの処理 */
function convertUrlProperty(property: unknown): string {
  if (!property || typeof property !== "object") {
    return ""
  }

  const typedProperty = property as { url?: string }
  return typedProperty.url || ""
}

/* メールプロパティの処理 */
function convertEmailProperty(property: unknown): string {
  if (!property || typeof property !== "object") {
    return ""
  }

  const typedProperty = property as { email?: string }
  return typedProperty.email || ""
}

/* 電話番号プロパティの処理 */
function convertPhoneNumberProperty(property: unknown): string {
  if (!property || typeof property !== "object") {
    return ""
  }

  const typedProperty = property as { phone_number?: string }
  return typedProperty.phone_number || ""
}

/* リレーションプロパティの処理 */
function convertRelationProperty(property: unknown): string[] {
  if (!property || typeof property !== "object") {
    return []
  }

  const typedProperty = property as { relation?: Array<{ id: string }> }

  if (!Array.isArray(typedProperty.relation)) {
    return []
  }

  return typedProperty.relation.map((item) => item.id || "").filter(Boolean)
}

/* 作成日時プロパティの処理 */
function convertCreatedTimeProperty(property: unknown): Date | null {
  if (!property || typeof property !== "object") {
    return null
  }

  const typedProperty = property as { created_time?: string }

  if (!typedProperty.created_time) {
    return null
  }

  return new Date(typedProperty.created_time)
}

/* 作成者プロパティの処理 */
function convertCreatedByProperty(property: unknown): NotionUser | null {
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

/* 最終編集日時プロパティの処理 */
function convertLastEditedTimeProperty(property: unknown): Date | null {
  if (!property || typeof property !== "object") {
    return null
  }

  const typedProperty = property as { last_edited_time?: string }

  if (!typedProperty.last_edited_time) {
    return null
  }

  return new Date(typedProperty.last_edited_time)
}

/* 最終編集者プロパティの処理 */
function convertLastEditedByProperty(property: unknown): NotionUser | null {
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

/* Notionの値をTypeScriptの値に変換 */
function convertFromNotion<T extends Schema>(
  schema: T,
  properties: Record<string, unknown>,
): SchemaType<T> {
  const result: Record<string, unknown> = {}

  for (const [key, config] of Object.entries(schema)) {
    const property = properties[key]

    /* 必須プロパティのチェック */
    if (!property && config.required) {
      throw new Error(`必須プロパティ ${key} が見つかりません`)
    }

    /* プロパティタイプに応じた変換 */
    if (config.type === "title") {
      result[key] = convertTitleProperty(property)
    }

    if (config.type === "rich_text") {
      result[key] = convertRichTextProperty(property)
    }

    if (config.type === "number") {
      result[key] = convertNumberProperty(property)
    }

    if (config.type === "select") {
      result[key] = convertSelectProperty(property)
    }

    if (config.type === "multi_select") {
      result[key] = convertMultiSelectProperty(property)
    }

    if (config.type === "status") {
      result[key] = convertStatusProperty(property)
    }

    if (config.type === "date") {
      result[key] = convertDateProperty(property)
    }

    if (config.type === "people") {
      result[key] = convertPeopleProperty(property)
    }

    if (config.type === "files") {
      result[key] = convertFilesProperty(property)
    }

    if (config.type === "checkbox") {
      result[key] = convertCheckboxProperty(property)
    }

    if (config.type === "url") {
      result[key] = convertUrlProperty(property)
    }

    if (config.type === "email") {
      result[key] = convertEmailProperty(property)
    }

    if (config.type === "phone_number") {
      result[key] = convertPhoneNumberProperty(property)
    }

    if (config.type === "relation") {
      result[key] = convertRelationProperty(property)
    }

    if (config.type === "created_time") {
      result[key] = convertCreatedTimeProperty(property)
    }

    if (config.type === "created_by") {
      result[key] = convertCreatedByProperty(property)
    }

    if (config.type === "last_edited_time") {
      result[key] = convertLastEditedTimeProperty(property)
    }

    if (config.type === "last_edited_by") {
      result[key] = convertLastEditedByProperty(property)
    }
  }

  return result as SchemaType<T>
}

/* タイトルプロパティの変換 */
function convertTitleToNotion(value: unknown): Record<string, unknown> {
  return {
    title: [{ type: "text", text: { content: String(value || "") } }],
  }
}

/* リッチテキストプロパティの変換 */
function convertRichTextToNotion(value: unknown): Record<string, unknown> {
  return {
    rich_text: [{ type: "text", text: { content: String(value || "") } }],
  }
}

/* 数値プロパティの変換 */
function convertNumberToNotion(value: unknown): Record<string, unknown> {
  if (typeof value !== "number") {
    return { number: null }
  }

  return { number: value }
}

/* 選択肢プロパティの変換 */
function convertSelectToNotion(value: unknown): Record<string, unknown> {
  if (typeof value !== "string" || value === "") {
    return { select: null }
  }

  return { select: { name: value } }
}

/* 複数選択プロパティの変換 */
function convertMultiSelectToNotion(value: unknown): Record<string, unknown> {
  if (!Array.isArray(value)) {
    return { multi_select: [] }
  }

  return {
    multi_select: value.map((item) => ({ name: String(item) })),
  }
}

/* ステータスプロパティの変換 */
function convertStatusToNotion(value: unknown): Record<string, unknown> {
  if (typeof value !== "string" || value === "") {
    return { status: null }
  }

  return { status: { name: value } }
}

/* 日付プロパティの変換 */
function convertDateToNotion(value: unknown): Record<string, unknown> {
  // DateRangeオブジェクトの場合
  if (value && typeof value === "object" && "start" in value) {
    const dateRange = value as DateRange
    return {
      date: {
        start: dateRange.start,
        end: dateRange.end,
      },
    }
  }

  // 従来の互換性のためDate型もサポート
  if (value instanceof Date) {
    return {
      date: {
        start: value.toISOString(),
        end: null,
      },
    }
  }

  // どちらでもない場合
  return { date: null }
}

/* 人物プロパティの変換 */
function convertPeopleToNotion(value: unknown): Record<string, unknown> {
  if (!Array.isArray(value)) {
    return { people: [] }
  }

  return {
    people: (value as NotionUser[])
      .filter((user) => user.id)
      .map((user) => ({ id: user.id })),
  }
}

/* ファイルプロパティの変換 */
function convertFilesToNotion(value: unknown): Record<string, unknown> {
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

/* チェックボックスプロパティの変換 */
function convertCheckboxToNotion(value: unknown): Record<string, unknown> {
  return { checkbox: Boolean(value) }
}

/* URLプロパティの変換 */
function convertUrlToNotion(value: unknown): Record<string, unknown> {
  return { url: String(value || "") }
}

/* メールプロパティの変換 */
function convertEmailToNotion(value: unknown): Record<string, unknown> {
  return { email: String(value || "") }
}

/* 電話番号プロパティの変換 */
function convertPhoneNumberToNotion(value: unknown): Record<string, unknown> {
  return { phone_number: String(value || "") }
}

/* リレーションプロパティの変換 */
function convertRelationToNotion(value: unknown): Record<string, unknown> {
  if (Array.isArray(value)) {
    return {
      relation: (value as string[]).filter((id) => id).map((id) => ({ id })),
    }
  }

  if (typeof value === "string" && value !== "") {
    return {
      relation: [{ id: value }],
    }
  }

  return { relation: [] }
}

/* TypeScriptの値をNotionの値に変換 */
function convertToNotion<T extends Schema>(
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

    /* プロパティタイプに応じた変換 */
    if (config.type === "title") {
      properties[key] = convertTitleToNotion(value)
    }

    if (config.type === "rich_text") {
      properties[key] = convertRichTextToNotion(value)
    }

    if (config.type === "number") {
      properties[key] = convertNumberToNotion(value)
    }

    if (config.type === "select") {
      properties[key] = convertSelectToNotion(value)
    }

    if (config.type === "multi_select") {
      properties[key] = convertMultiSelectToNotion(value)
    }

    if (config.type === "status") {
      properties[key] = convertStatusToNotion(value)
    }

    if (config.type === "date") {
      properties[key] = convertDateToNotion(value)
    }

    if (config.type === "people") {
      properties[key] = convertPeopleToNotion(value)
    }

    if (config.type === "files") {
      properties[key] = convertFilesToNotion(value)
    }

    if (config.type === "checkbox") {
      properties[key] = convertCheckboxToNotion(value)
    }

    if (config.type === "url") {
      properties[key] = convertUrlToNotion(value)
    }

    if (config.type === "email") {
      properties[key] = convertEmailToNotion(value)
    }

    if (config.type === "phone_number") {
      properties[key] = convertPhoneNumberToNotion(value)
    }

    if (config.type === "relation") {
      properties[key] = convertRelationToNotion(value)
    }
  }

  return properties
}

/* スキーマ定義関数 */
export function defineSchema<T extends Schema>(schema: T): T {
  return schema
}

/* データベースクライアント */
export class Table<T extends Schema> {
  private notion: Client
  private tableId: string
  private schema: T

  constructor(options: TableOptions<T>) {
    this.notion = options.notion
    this.tableId = options.tableId
    this.schema = options.schema
  }

  /* 複数レコード取得（ページネーション・ソート機能付き） */
  async findMany(
    options: FindOptions<T> = {},
  ): Promise<QueryResult<SchemaType<T>>> {
    const { where = {}, count = 100, sorts } = options

    /* 件数のバリデーション（最大1024件まで） */
    const maxCount = Math.min(Math.max(1, count), 1024)
    const pageSize = Math.min(maxCount, 100) // APIの1回のリクエストで取得可能な最大件数

    /* フィルター条件をNotionのフィルター形式に変換 */
    const notionFilter: { and: Array<Record<string, unknown>> } = {
      and: [],
    }

    for (const [key, value] of Object.entries(where)) {
      if (value === undefined) {
        continue
      }

      const config = this.schema[key]

      if (!config) {
        continue
      }

      /* タイトルタイプ */
      if (config.type === "title") {
        notionFilter.and.push({
          property: key,
          title: {
            contains: String(value),
          },
        })
      }

      /* リッチテキストタイプ */
      if (config.type === "rich_text") {
        notionFilter.and.push({
          property: key,
          rich_text: {
            contains: String(value),
          },
        })
      }

      /* 数値タイプ */
      if (config.type === "number" && typeof value === "number") {
        notionFilter.and.push({
          property: key,
          number: {
            equals: value,
          },
        })
      }

      /* 選択肢タイプ */
      if (config.type === "select" && typeof value === "string") {
        notionFilter.and.push({
          property: key,
          select: {
            equals: value,
          },
        })
      }

      /* ステータスタイプ */
      if (config.type === "status" && typeof value === "string") {
        notionFilter.and.push({
          property: key,
          status: {
            equals: value,
          },
        })
      }

      /* 複数選択タイプ */
      if (config.type === "multi_select" && typeof value === "string") {
        notionFilter.and.push({
          property: key,
          multi_select: {
            contains: value,
          },
        })
      }

      /* 日付タイプ */
      if (config.type === "date") {
        // DateRange型の場合
        if (value && typeof value === "object" && "start" in value) {
          const dateRange = value as DateRange
          notionFilter.and.push({
            property: key,
            date: {
              on: dateRange.start.split("T")[0], // 日付部分のみ使用
            },
          })
        }
        // 従来互換用のDate型の場合
        else if (value instanceof Date) {
          notionFilter.and.push({
            property: key,
            date: {
              on: value.toISOString().split("T")[0],
            },
          })
        }
      }

      /* チェックボックスタイプ */
      if (config.type === "checkbox") {
        notionFilter.and.push({
          property: key,
          checkbox: {
            equals: Boolean(value),
          },
        })
      }

      /* リレーションタイプ */
      if (config.type === "relation" && typeof value === "string") {
        notionFilter.and.push({
          property: key,
          relation: {
            contains: value,
          },
        })
      }
    }

    /* ソートオプションをNotionのソート形式に変換 */
    const notionSort = []
    if (sorts) {
      const sortArray = Array.isArray(sorts) ? sorts : [sorts]
      for (const sortOption of sortArray) {
        notionSort.push({
          property: String(sortOption.field),
          direction:
            sortOption.direction === "asc" ? "ascending" : "descending",
        })
      }
    }

    /* 複数ページにわたってデータを取得 */
    let allRecords: TableRecord<SchemaType<T>>[] = []
    let nextCursor: string | null = null
    let hasMore = true

    while (hasMore && allRecords.length < maxCount) {
      const response = await this.notion.databases.query({
        database_id: this.tableId,
        filter:
          notionFilter.and.length > 0 ? (notionFilter as never) : undefined,
        sorts: notionSort.length > 0 ? (notionSort as never) : undefined,
        start_cursor: nextCursor || undefined,
        page_size: pageSize,
      })

      const pageRecords = response.results.map((page) => {
        const typedPage = page as unknown as NotionPage
        const itemData = convertFromNotion(this.schema, typedPage.properties)
        return {
          id: typedPage.id,
          createdAt: typedPage.created_time,
          updatedAt: typedPage.last_edited_time,
          isDeleted: typedPage.archived,
          ...itemData,
        } as TableRecord<SchemaType<T>>
      })

      allRecords = [...allRecords, ...pageRecords]
      nextCursor = response.next_cursor
      hasMore = response.has_more && allRecords.length < maxCount

      /* 最大件数に達したら切り捨て */
      if (allRecords.length > maxCount) {
        allRecords = allRecords.slice(0, maxCount)
      }
    }

    return {
      records: allRecords,
      cursor: nextCursor,
      hasMore,
    }
  }

  /* 指定した条件に一致する最初のレコードを取得 */
  async findOne(
    options: FindOptions<T> = {},
  ): Promise<TableRecord<SchemaType<T>> | null> {
    const result = await this.findMany({
      ...options,
      count: 1,
    })
    const [firstRecord] = result.records
    return firstRecord || null
  }

  /* IDで1件取得 */
  async findById(id: string): Promise<TableRecord<SchemaType<T>> | null> {
    try {
      const response = await this.notion.pages.retrieve({ page_id: id })
      const typedPage = response as unknown as NotionPage
      const data = convertFromNotion(this.schema, typedPage.properties)

      return {
        id: typedPage.id,
        createdAt: typedPage.created_time,
        updatedAt: typedPage.last_edited_time,
        isDeleted: typedPage.archived,
        ...data,
      } as TableRecord<SchemaType<T>>
    } catch (error) {
      return null
    }
  }

  /* レコード作成 */
  async create(
    data: Partial<SchemaType<T>> & { body?: string },
  ): Promise<PageObjectResponse> {
    /* 必須フィールドのチェック */
    for (const [key, config] of Object.entries(this.schema)) {
      if (config.required && (data[key] === undefined || data[key] === null)) {
        throw new Error(`必須フィールド ${key} が指定されていません`)
      }
    }

    const properties = convertToNotion(this.schema, data)

    const response = await this.notion.pages.create({
      parent: { database_id: this.tableId },
      properties: properties as never,
      children: data.body ? toNotionBlocks(data.body) : undefined,
    })

    return response as PageObjectResponse
  }

  /* レコード更新 */
  async update(
    id: string,
    data: Partial<SchemaType<T>> & { body?: string | null },
  ): Promise<void> {
    const properties = convertToNotion(this.schema, data)

    await this.notion.pages.update({
      page_id: id,
      properties: properties as never,
    })

    if (data.body) {
      const blocksResult = await this.notion.blocks.children.list({
        block_id: id,
      })

      for (const block of blocksResult.results) {
        await this.notion.blocks.delete({
          block_id: block.id,
        })
      }

      await this.notion.blocks.children.append({
        block_id: id,
        children: toNotionBlocks(data.body),
      })
    }
  }

  /* 条件に一致する複数レコードを更新 */
  async updateMany(options: UpdateManyOptions<T>): Promise<number> {
    const { where = {}, update, count = 1024 } = options

    /* 最大1024件まで取得して更新 */
    const result = await this.findMany({
      where,
      count,
    })

    let updated = 0
    /* 取得したレコードを1件ずつ更新 */
    for (const record of result.records) {
      await this.update(record.id, update)
      updated++
    }

    return updated
  }

  /* upsert処理（既存レコードがあれば更新、なければ作成） */
  async upsert(options: UpsertOptions<T>): Promise<TableRecord<SchemaType<T>>> {
    const { where, insert = {}, update } = options

    /* 既存レコードを探す */
    const existingRecord = await this.findOne({ where })

    /* 既存レコードがあれば更新、なければ作成 */
    if (existingRecord) {
      await this.update(existingRecord.id, update)

      /* 更新後のデータを取得して返す */
      const updated = await this.findById(existingRecord.id)
      return updated as TableRecord<SchemaType<T>>
    }

    /* 新規作成（whereデータとinsertデータをマージ） */
    const createData = { ...where, ...insert } as Partial<SchemaType<T>>
    const newId = await this.create(createData)

    /* 作成したデータを取得して返す */
    const created = await this.findById(newId)
    return created as TableRecord<SchemaType<T>>
  }

  /* 条件に一致する複数レコードを削除（アーカイブ） */
  async deleteMany(where: WhereCondition<T> = {}): Promise<number> {
    /* 最大1024件まで取得して削除 */
    const result = await this.findMany({
      where,
      count: 1024,
    })

    let deleted = 0
    /* 取得したレコードを1件ずつ削除 */
    for (const record of result.records) {
      await this.delete(record.id)
      deleted++
    }

    return deleted
  }

  /* レコード削除（アーカイブ） */
  async delete(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      archived: true,
    })
  }

  /* レコード復元 */
  async restore(id: string): Promise<void> {
    await this.notion.pages.update({
      page_id: id,
      archived: false,
    })
  }
}

/* テーブル作成関数 */
export function defineTable<T extends Schema>(
  options: TableOptions<T>,
): Table<T> {
  return new Table(options)
}
