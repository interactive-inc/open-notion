import { z } from "zod"

/**
 * タイトルプロパティ設定のスキーマ
 */
export const zTitlePropertyConfig = z.object({
  type: z.literal("title"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * リッチテキストプロパティ設定のスキーマ
 */
export const zRichTextPropertyConfig = z.object({
  type: z.literal("rich_text"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 数値フォーマット
 */
const zNumberFormat = z.enum([
  "number",
  "number_with_commas",
  "percent",
  "dollar",
  "euro",
  "pound",
  "yen",
  "ruble",
  "rupee",
  "won",
  "yuan",
])

/**
 * 数値プロパティ設定のスキーマ
 */
export const zNumberPropertyConfig = z.object({
  type: z.literal("number"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
  format: zNumberFormat.optional(),
  min: z.number().optional(),
  max: z.number().optional(),
})

/**
 * チェックボックスプロパティ設定のスキーマ
 */
export const zCheckboxPropertyConfig = z.object({
  type: z.literal("checkbox"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * セレクトプロパティ設定のスキーマ
 */
export const zSelectPropertyConfig = z.object({
  type: z.literal("select"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
  options: z.union([z.array(z.string()).readonly(), z.array(z.string())]),
})

/**
 * マルチセレクトプロパティ設定のスキーマ
 */
export const zMultiSelectPropertyConfig = z.object({
  type: z.literal("multi_select"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
  options: z.array(z.string()).nullable(),
})

/**
 * ステータスプロパティ設定のスキーマ
 */
export const zStatusPropertyConfig = z.object({
  type: z.literal("status"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
  options: z.union([z.array(z.string()).readonly(), z.array(z.string())]),
})

/**
 * 日付プロパティ設定のスキーマ
 */
export const zDatePropertyConfig = z.object({
  type: z.literal("date"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * URLプロパティ設定のスキーマ
 */
export const zUrlPropertyConfig = z.object({
  type: z.literal("url"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * メールプロパティ設定のスキーマ
 */
export const zEmailPropertyConfig = z.object({
  type: z.literal("email"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 電話番号プロパティ設定のスキーマ
 */
export const zPhoneNumberPropertyConfig = z.object({
  type: z.literal("phone_number"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * リレーションプロパティ設定のスキーマ
 */
export const zRelationPropertyConfig = z.object({
  type: z.literal("relation"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
  database_id: z.string(),
  single_property: z.boolean().optional(),
})

/**
 * ピープルプロパティ設定のスキーマ
 */
export const zPeoplePropertyConfig = z.object({
  type: z.literal("people"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * ファイルプロパティ設定のスキーマ
 */
export const zFilesPropertyConfig = z.object({
  type: z.literal("files"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 作成日時プロパティ設定のスキーマ
 */
export const zCreatedTimePropertyConfig = z.object({
  type: z.literal("created_time"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 作成者プロパティ設定のスキーマ
 */
export const zCreatedByPropertyConfig = z.object({
  type: z.literal("created_by"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 最終編集日時プロパティ設定のスキーマ
 */
export const zLastEditedTimePropertyConfig = z.object({
  type: z.literal("last_edited_time"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 最終編集者プロパティ設定のスキーマ
 */
export const zLastEditedByPropertyConfig = z.object({
  type: z.literal("last_edited_by"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
})

/**
 * 式プロパティ設定のスキーマ
 */
export const zFormulaPropertyConfig = z.object({
  type: z.literal("formula"),
  required: z.boolean().optional(),
  validate: z.any().optional(),
  formulaType: z.enum(["string", "number", "boolean", "date"]),
})

/**
 * プロパティ設定のユニオンスキーマ
 */
export const zPropertyConfig = z.discriminatedUnion("type", [
  zTitlePropertyConfig,
  zRichTextPropertyConfig,
  zNumberPropertyConfig,
  zCheckboxPropertyConfig,
  zSelectPropertyConfig,
  zMultiSelectPropertyConfig,
  zStatusPropertyConfig,
  zDatePropertyConfig,
  zUrlPropertyConfig,
  zEmailPropertyConfig,
  zPhoneNumberPropertyConfig,
  zRelationPropertyConfig,
  zPeoplePropertyConfig,
  zFilesPropertyConfig,
  zCreatedTimePropertyConfig,
  zCreatedByPropertyConfig,
  zLastEditedTimePropertyConfig,
  zLastEditedByPropertyConfig,
  zFormulaPropertyConfig,
])

/**
 * スキーマのスキーマ
 */
export const zSchema = z.record(z.string(), zPropertyConfig)
