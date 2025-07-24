import type { Client } from "@notionhq/client"

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
  | "formula"

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
  validate?: (value: unknown) => boolean | string
}

/* 数値フォーマット型 */
type NumberFormat =
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

/* タイトルプロパティ */
export type TitlePropertyConfig = BasePropertyConfig & {
  type: "title"
}

/* リッチテキストプロパティ */
export type RichTextPropertyConfig = BasePropertyConfig & {
  type: "rich_text"
}

/* 数値プロパティ */
export type NumberPropertyConfig = BasePropertyConfig & {
  type: "number"
  format?: NumberFormat
  min?: number
  max?: number
}

/* 選択肢プロパティ */
export type SelectPropertyConfig = BasePropertyConfig & {
  type: "select"
  options: readonly string[] | string[]
}

/* 複数選択プロパティ */
export type MultiSelectPropertyConfig = BasePropertyConfig & {
  type: "multi_select"
  options: string[] | null
}

/* ステータスプロパティ */
export type StatusPropertyConfig = BasePropertyConfig & {
  type: "status"
  options: readonly string[] | string[]
}

/* 日付プロパティ */
export type DatePropertyConfig = BasePropertyConfig & {
  type: "date"
}

/* 人物プロパティ */
export type PeoplePropertyConfig = BasePropertyConfig & {
  type: "people"
}

/* ファイルプロパティ */
export type FilesPropertyConfig = BasePropertyConfig & {
  type: "files"
}

/* チェックボックスプロパティ */
export type CheckboxPropertyConfig = BasePropertyConfig & {
  type: "checkbox"
}

/* URLプロパティ */
export type UrlPropertyConfig = BasePropertyConfig & {
  type: "url"
}

/* メールプロパティ */
export type EmailPropertyConfig = BasePropertyConfig & {
  type: "email"
}

/* 電話番号プロパティ */
export type PhoneNumberPropertyConfig = BasePropertyConfig & {
  type: "phone_number"
}

/* リレーションプロパティ */
export type RelationPropertyConfig = BasePropertyConfig & {
  type: "relation"
  database_id: string
  single_property?: boolean
}

/* 作成日時プロパティ */
export type CreatedTimePropertyConfig = BasePropertyConfig & {
  type: "created_time"
}

/* 作成者プロパティ */
export type CreatedByPropertyConfig = BasePropertyConfig & {
  type: "created_by"
}

/* 最終編集日時プロパティ */
export type LastEditedTimePropertyConfig = BasePropertyConfig & {
  type: "last_edited_time"
}

/* 最終編集者プロパティ */
export type LastEditedByPropertyConfig = BasePropertyConfig & {
  type: "last_edited_by"
}

/* フォーミュラプロパティ */
export type FormulaPropertyConfig = BasePropertyConfig & {
  type: "formula"
  formulaType: "string" | "number" | "boolean" | "date"
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
  | FormulaPropertyConfig

/* データベーススキーマの定義 */
export type Schema = Record<string, PropertyConfig>

/* スキーマから型を生成するための型マッピング */
export type PropertyTypeMapping<T extends PropertyConfig> = T extends
  | TitlePropertyConfig
  | RichTextPropertyConfig
  ? string
  : T extends NumberPropertyConfig
    ? number
    : T extends SelectPropertyConfig | StatusPropertyConfig
      ? T["options"] extends readonly (infer U)[]
        ? U
        : T["options"] extends (infer U)[]
          ? U
          : never
      : T extends MultiSelectPropertyConfig
        ? T["options"] extends null
          ? string[]
          : T["options"] extends string[]
            ? T["options"][number][]
            : string[]
        : T extends DatePropertyConfig
          ? DateRange
          : T extends PeoplePropertyConfig
            ? NotionUser[]
            : T extends FilesPropertyConfig
              ? NotionFile[]
              : T extends CheckboxPropertyConfig
                ? boolean
                : T extends
                      | UrlPropertyConfig
                      | EmailPropertyConfig
                      | PhoneNumberPropertyConfig
                  ? string
                  : T extends RelationPropertyConfig
                    ? string[]
                    : T extends
                          | CreatedTimePropertyConfig
                          | LastEditedTimePropertyConfig
                      ? Date
                      : T extends
                            | CreatedByPropertyConfig
                            | LastEditedByPropertyConfig
                        ? NotionUser
                        : T extends FormulaPropertyConfig
                          ? T["formulaType"] extends "string"
                            ? string
                            : T["formulaType"] extends "number"
                              ? number
                              : T["formulaType"] extends "boolean"
                                ? boolean
                                : T["formulaType"] extends "date"
                                  ? DateRange
                                  : never
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
export type RequiredKeys<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T] &
  keyof SchemaType<T>

/* 必須フィールドの型 */
export type RequiredFields<T extends Schema> = {
  [K in RequiredKeys<T>]: SchemaType<T>[K]
}

/* テーブル作成オプション */
export type TableOptions<T extends Schema> = {
  notion: Client
  tableId: string
  schema: T
}

/* 高度なクエリ条件 */
export type QueryOperator<T> = {
  $eq?: T
  $ne?: T
  $gt?: T
  $gte?: T
  $lt?: T
  $lte?: T
  $in?: T[]
  $contains?: T extends string ? string : never
}

export type WhereCondition<T extends Schema> = {
  [K in keyof SchemaType<T>]?:
    | SchemaType<T>[K]
    | QueryOperator<SchemaType<T>[K]>
} & {
  $or?: WhereCondition<T>[]
  $and?: WhereCondition<T>[]
}

/* クエリオプション型を拡張 */
export type FindOptions<T extends Schema> = {
  where?: WhereCondition<T>
  count?: number
  sorts?: SortOption<T> | SortOption<T>[]
}

/* updateMany用のオプション型 */
export type UpdateManyOptions<T extends Schema> = {
  where?: WhereCondition<T>
  update: Partial<SchemaType<T>>
  count?: number
}

/* upsert用のオプション型 */
export type UpsertOptions<T extends Schema> = {
  where: WhereCondition<T>
  insert: Partial<SchemaType<T>> & RequiredFields<T>
  update: Partial<SchemaType<T>>
}

/* クエリ結果型 */
export type QueryResult<T> = {
  records: TableRecord<T>[]
  cursor: string | null
  hasMore: boolean
}

/* バッチ操作結果型 */
export type BatchResult<T> = {
  succeeded: T[]
  failed: Array<{
    data: unknown
    error: Error
  }>
}

/* フック定義 */
export type TableHooks<T extends Schema> = {
  beforeCreate?: (
    data: Partial<SchemaType<T>>,
  ) => Promise<Partial<SchemaType<T>>>
  afterCreate?: (record: TableRecord<SchemaType<T>>) => Promise<void>
  beforeUpdate?: (
    id: string,
    data: Partial<SchemaType<T>>,
  ) => Promise<Partial<SchemaType<T>>>
  afterUpdate?: (
    id: string,
    record: TableRecord<SchemaType<T>>,
  ) => Promise<void>
  beforeDelete?: (id: string) => Promise<void>
  afterDelete?: (id: string) => Promise<void>
}

/* キャッシュエントリ */
export type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
}

/* キャッシュインターフェース */
export type NotionMemoeryCacheInterface = {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T, ttl?: number): void
  delete(key: string): void
  clear(): void
}

/* バリデーターインターフェース */
export type ValidatorInterface = {
  validate(schema: Schema, data: unknown): Record<string, unknown>
}

/* クエリビルダーインターフェース */
export type NotionQueryBuilderInterface = {
  buildFilter(where: WhereCondition<any>): any
  buildSorts(sorts: SortOption<any> | SortOption<any>[]): any[]
}

/* コンバーターインターフェース */
export type NotionConverterInterface = {
  convertFromNotion(property: any, config: PropertyConfig): any
  convertToNotion(value: any, config: PropertyConfig): any
}
