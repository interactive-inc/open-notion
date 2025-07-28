import type { Client } from "@notionhq/client"

/* Notion page object type */
export type NotionPage = {
  id: string
  url: string
  created_time: string
  last_edited_time: string
  archived: boolean
  properties: Record<string, unknown>
}

/* Notion base data types */
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

/* Notion user type */
export type NotionUser = {
  id: string
  name?: string
  avatar_url?: string
  email?: string
}

/* Notion file type */
export type NotionFile = {
  name: string
  url: string
  type: "file" | "external"
}

/* Date range type */
export type DateRange = {
  start: string
  end: string | null
}

/* Common property config */
type BasePropertyConfig = {
  required?: boolean
  validate?: (value: unknown) => boolean | string
}

/* Number format type */
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

export type TitlePropertyConfig = BasePropertyConfig & {
  type: "title"
}

export type RichTextPropertyConfig = BasePropertyConfig & {
  type: "rich_text"
}

export type NumberPropertyConfig = BasePropertyConfig & {
  type: "number"
  format?: NumberFormat
  min?: number
  max?: number
}

export type SelectPropertyConfig = BasePropertyConfig & {
  type: "select"
  options: readonly string[] | string[]
}

export type MultiSelectPropertyConfig = BasePropertyConfig & {
  type: "multi_select"
  options: string[] | null
}

export type StatusPropertyConfig = BasePropertyConfig & {
  type: "status"
  options: readonly string[] | string[]
}

export type DatePropertyConfig = BasePropertyConfig & {
  type: "date"
}

export type PeoplePropertyConfig = BasePropertyConfig & {
  type: "people"
}

export type FilesPropertyConfig = BasePropertyConfig & {
  type: "files"
}

export type CheckboxPropertyConfig = BasePropertyConfig & {
  type: "checkbox"
}

export type UrlPropertyConfig = BasePropertyConfig & {
  type: "url"
}

export type EmailPropertyConfig = BasePropertyConfig & {
  type: "email"
}

export type PhoneNumberPropertyConfig = BasePropertyConfig & {
  type: "phone_number"
}

export type RelationPropertyConfig = BasePropertyConfig & {
  type: "relation"
  database_id: string
  single_property?: boolean
}

export type CreatedTimePropertyConfig = BasePropertyConfig & {
  type: "created_time"
}

export type CreatedByPropertyConfig = BasePropertyConfig & {
  type: "created_by"
}

export type LastEditedTimePropertyConfig = BasePropertyConfig & {
  type: "last_edited_time"
}

export type LastEditedByPropertyConfig = BasePropertyConfig & {
  type: "last_edited_by"
}

export type FormulaPropertyConfig = BasePropertyConfig & {
  type: "formula"
  formulaType: "string" | "number" | "boolean" | "date"
}

/* All property config types */
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

/* Database schema definition */
export type Schema = Record<string, PropertyConfig>

/* Type mapping for schema */
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

/* Generate type from schema */
export type SchemaType<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true }
    ? PropertyTypeMapping<T[K]>
    : PropertyTypeMapping<T[K]> | null | undefined
}

/* Record type definition */
export type TableRecord<T> = T & {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

/* Sort option type */
export type SortOption<T extends Schema> = {
  field: keyof SchemaType<T>
  direction: "asc" | "desc"
}

/* Get required field keys */
export type RequiredKeys<T extends Schema> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T] &
  keyof SchemaType<T>

/* Required fields type */
export type RequiredFields<T extends Schema> = {
  [K in RequiredKeys<T>]: SchemaType<T>[K]
}

/* Table creation options */
export type TableOptions<T extends Schema> = {
  notion: Client
  tableId: string
  schema: T
}

/* Advanced query operators */
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

export type FindOptions<T extends Schema> = {
  where?: WhereCondition<T>
  count?: number
  sorts?: SortOption<T> | SortOption<T>[]
}

export type UpdateManyOptions<T extends Schema> = {
  where?: WhereCondition<T>
  update: Partial<SchemaType<T>>
  count?: number
}

export type UpsertOptions<T extends Schema> = {
  where: WhereCondition<T>
  insert: Partial<SchemaType<T>> & RequiredFields<T>
  update: Partial<SchemaType<T>>
}

/* Query result type */
export type QueryResult<T> = {
  records: TableRecord<T>[]
  cursor: string | null
  hasMore: boolean
}

/* Batch operation result */
export type BatchResult<T> = {
  succeeded: T[]
  failed: Array<{
    data: unknown
    error: Error
  }>
}

/* Hook definitions */
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

/* Cache entry */
export type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
}

/* Cache interface */
export type NotionMemoeryCacheInterface = {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T, ttl?: number): void
  delete(key: string): void
  clear(): void
}

/* Validator interface */
export type ValidatorInterface = {
  validate(schema: Schema, data: unknown): Record<string, unknown>
}

/* Query builder interface */
export type NotionQueryBuilderInterface = {
  buildFilter(where: WhereCondition<any>): any
  buildSorts(sorts: SortOption<any> | SortOption<any>[]): any[]
}

/* Converter interface */
export type NotionConverterInterface = {
  convertFromNotion(property: any, config: PropertyConfig): any
  convertToNotion(value: any, config: PropertyConfig): any
}
