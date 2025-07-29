import { expect, test } from "bun:test"
import type { Schema } from "@/types"
import { NotionSchemaValidator } from "./notion-schema-validator"

test("必須フィールドのバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    title: { type: "title", required: true },
    description: { type: "rich_text" },
  }

  // 必須フィールドが存在しない場合
  expect(() => {
    validator.validate(schema, { description: "説明" })
  }).toThrow('Required field "title" is missing')

  // 必須フィールドがnullの場合
  expect(() => {
    validator.validate(schema, { title: null })
  }).toThrow('Required field "title" is missing')

  // 正常な場合
  expect(() => {
    validator.validate(schema, { title: "タイトル" })
  }).not.toThrow()
})

test("文字列型のバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    title: { type: "title" },
    description: { type: "rich_text" },
  }

  // 文字列以外の値
  expect(() => {
    validator.validate(schema, { title: 123 })
  }).toThrow('Field "title" must be a string')

  // 正常な場合
  expect(() => {
    validator.validate(schema, { title: "タイトル" })
  }).not.toThrow()
})

test("数値型のバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    priority: { type: "number", min: 1, max: 10 },
    score: { type: "number" },
  }

  // 数値以外の値
  expect(() => {
    validator.validate(schema, { priority: "高" })
  }).toThrow('Field "priority" must be a number')

  // 最小値未満
  expect(() => {
    validator.validate(schema, { priority: 0 })
  }).toThrow('Field "priority" must be at least 1')

  // 最大値超過
  expect(() => {
    validator.validate(schema, { priority: 11 })
  }).toThrow('Field "priority" must be at most 10')

  // 正常な場合
  expect(() => {
    validator.validate(schema, { priority: 5 })
  }).not.toThrow()
})

test("選択肢型のバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    status: { type: "select", options: ["todo", "in_progress", "done"] },
    category: { type: "status", options: ["bug", "feature", "task"] },
  }

  // 許可されていない値
  expect(() => {
    validator.validate(schema, { status: "完了" })
  }).toThrow(
    'Field "status" value "完了" is not allowed. Allowed values: todo, in_progress, done',
  )

  // 正常な場合
  expect(() => {
    validator.validate(schema, { status: "todo" })
  }).not.toThrow()
})

test("複数選択型のバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    tags: {
      type: "multi_select",
      options: ["javascript", "typescript", "react"],
    },
    labels: { type: "multi_select", options: null }, // 任意の値を許可
  }

  // 配列以外の値
  expect(() => {
    validator.validate(schema, { tags: "javascript" })
  }).toThrow('Field "tags" must be an array')

  // 許可されていない値を含む配列
  expect(() => {
    validator.validate(schema, { tags: ["javascript", "python"] })
  }).toThrow(
    'Field "tags" value "python" is not allowed. Allowed values: javascript, typescript, react',
  )

  // 任意の値を許可する場合
  expect(() => {
    validator.validate(schema, { labels: ["任意1", "任意2"] })
  }).not.toThrow()

  // 正常な場合
  expect(() => {
    validator.validate(schema, { tags: ["javascript", "react"] })
  }).not.toThrow()
})

test("日付型のバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    deadline: { type: "date" },
  }

  // DateRange型
  expect(() => {
    validator.validate(schema, {
      deadline: { start: "2024-01-01", end: "2024-01-31" },
    })
  }).not.toThrow()

  // Date型
  expect(() => {
    validator.validate(schema, { deadline: new Date() })
  }).not.toThrow()

  // 無効な形式
  expect(() => {
    validator.validate(schema, { deadline: "2024-01-01" })
  }).toThrow('Field "deadline" must be a Date object or DateRange type')

  // 開始日が文字列でない
  expect(() => {
    validator.validate(schema, { deadline: { start: 123, end: null } })
  }).toThrow('Field "deadline" start date must be a string')
})

test("メールアドレスのバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    email: { type: "email" },
  }

  // 無効なメールアドレス
  expect(() => {
    validator.validate(schema, { email: "invalid-email" })
  }).toThrow('Field "email" must be a valid email address')

  // 有効なメールアドレス
  expect(() => {
    validator.validate(schema, { email: "test@example.com" })
  }).not.toThrow()
})

test("URLのバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    website: { type: "url" },
  }

  // 無効なURL
  expect(() => {
    validator.validate(schema, { website: "not-a-url" })
  }).toThrow('Field "website" must be a valid URL')

  // 有効なURL
  expect(() => {
    validator.validate(schema, { website: "https://example.com" })
  }).not.toThrow()
})

test("カスタムバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    password: {
      type: "rich_text",
      validate: (value) => {
        if (typeof value !== "string") return false
        if (value.length < 8) return "パスワードは8文字以上である必要があります"
        if (!/[A-Z]/.test(value))
          return "パスワードは大文字を含む必要があります"
        if (!/[0-9]/.test(value)) return "パスワードは数字を含む必要があります"
        return true
      },
    },
  }

  // カスタムバリデーションのエラーメッセージ
  expect(() => {
    validator.validate(schema, { password: "short" })
  }).toThrow('Field "password": パスワードは8文字以上である必要があります')

  expect(() => {
    validator.validate(schema, { password: "lowercase123" })
  }).toThrow('Field "password": パスワードは大文字を含む必要があります')

  expect(() => {
    validator.validate(schema, { password: "NoNumbers" })
  }).toThrow('Field "password": パスワードは数字を含む必要があります')

  // 正常な場合
  expect(() => {
    validator.validate(schema, { password: "StrongPass123" })
  }).not.toThrow()
})

test("リレーション型のバリデーション", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    related: { type: "relation", database_id: "database-id" },
  }

  // 文字列
  expect(() => {
    validator.validate(schema, { related: "page-id" })
  }).not.toThrow()

  // 文字列配列
  expect(() => {
    validator.validate(schema, { related: ["page-id-1", "page-id-2"] })
  }).not.toThrow()

  // 無効な型
  expect(() => {
    validator.validate(schema, { related: 123 })
  }).toThrow('Field "related" must be a string or string array')

  // 配列内に文字列以外
  expect(() => {
    validator.validate(schema, { related: ["page-id", 123] })
  }).toThrow('Field "related" relation IDs must be strings')
})

test("オブジェクト以外のデータ", () => {
  const validator = new NotionSchemaValidator()
  const schema: Schema = {
    title: { type: "title" },
  }

  expect(() => {
    validator.validate(schema, null)
  }).toThrow("Data must be an object")

  expect(() => {
    validator.validate(schema, "文字列")
  }).toThrow("Data must be an object")

  expect(() => {
    validator.validate(schema, 123)
  }).toThrow("Data must be an object")
})
