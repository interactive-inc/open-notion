import type { NumberPropertyConfig, PropertyConfig, Schema } from "./types"

export class NotionSchemaValidator {
  validate<T extends Schema>(schema: T, data: unknown): void {
    if (!data || typeof data !== "object") {
      throw new Error("データはオブジェクトである必要があります")
    }

    const dataObj = data as Record<string, unknown>

    for (const [key, config] of Object.entries(schema)) {
      const value = dataObj[key]

      // 必須チェック
      if (config.required && (value === undefined || value === null)) {
        throw new Error(`必須フィールド "${key}" が指定されていません`)
      }

      // 値が存在する場合のみバリデーション
      if (value !== undefined && value !== null) {
        this.validateField(key, value, config)
      }
    }
  }

  private validateField(
    key: string,
    value: unknown,
    config: PropertyConfig,
  ): void {
    // カスタムバリデーション
    if (config.validate) {
      const result = config.validate(value)
      if (typeof result === "string") {
        throw new Error(`フィールド "${key}": ${result}`)
      }
      if (!result) {
        throw new Error(`フィールド "${key}" のバリデーションに失敗しました`)
      }
    }

    // 型別のバリデーション
    if (config.type === "title" || config.type === "rich_text") {
      if (typeof value !== "string") {
        throw new Error(`フィールド "${key}" は文字列である必要があります`)
      }
      return
    }

    if (config.type === "number") {
      if (typeof value !== "number") {
        throw new Error(`フィールド "${key}" は数値である必要があります`)
      }
      this.validateNumberRange(key, value, config)
      return
    }

    if (config.type === "select" || config.type === "status") {
      if (typeof value !== "string") {
        throw new Error(`フィールド "${key}" は文字列である必要があります`)
      }
      if (!config.options.includes(value)) {
        throw new Error(
          `フィールド "${key}" の値 "${value}" は許可されていません。許可される値: ${config.options.join(", ")}`,
        )
      }
      return
    }

    if (config.type === "multi_select") {
      if (!Array.isArray(value)) {
        throw new Error(`フィールド "${key}" は配列である必要があります`)
      }
      if (config.options !== null) {
        for (const item of value) {
          if (!config.options.includes(item)) {
            throw new Error(
              `フィールド "${key}" の値 "${item}" は許可されていません。許可される値: ${config.options.join(", ")}`,
            )
          }
        }
      }
      return
    }

    if (config.type === "date") {
      if (typeof value === "object" && value && "start" in value) {
        const dateRange = value as { start: unknown; end: unknown }
        if (typeof dateRange.start !== "string") {
          throw new Error(
            `フィールド "${key}" の開始日は文字列である必要があります`,
          )
        }
        if (dateRange.end !== null && typeof dateRange.end !== "string") {
          throw new Error(
            `フィールド "${key}" の終了日は文字列またはnullである必要があります`,
          )
        }
        return
      }
      if (!(value instanceof Date)) {
        throw new Error(
          `フィールド "${key}" はDateオブジェクトまたはDateRange型である必要があります`,
        )
      }
      return
    }

    if (config.type === "people" || config.type === "files") {
      if (!Array.isArray(value)) {
        throw new Error(`フィールド "${key}" は配列である必要があります`)
      }
      return
    }

    if (config.type === "checkbox") {
      if (typeof value !== "boolean") {
        throw new Error(`フィールド "${key}" は真偽値である必要があります`)
      }
      return
    }

    if (config.type === "url") {
      if (typeof value !== "string") {
        throw new Error(`フィールド "${key}" は文字列である必要があります`)
      }
      if (value && !this.isValidUrl(value)) {
        throw new Error(`フィールド "${key}" は有効なURLである必要があります`)
      }
      return
    }

    if (config.type === "email") {
      if (typeof value !== "string") {
        throw new Error(`フィールド "${key}" は文字列である必要があります`)
      }
      if (value && !this.isValidEmail(value)) {
        throw new Error(
          `フィールド "${key}" は有効なメールアドレスである必要があります`,
        )
      }
      return
    }

    if (config.type === "phone_number") {
      if (typeof value !== "string") {
        throw new Error(`フィールド "${key}" は文字列である必要があります`)
      }
      return
    }

    if (config.type === "relation") {
      if (Array.isArray(value)) {
        for (const id of value) {
          if (typeof id !== "string") {
            throw new Error(
              `フィールド "${key}" のリレーションIDは文字列である必要があります`,
            )
          }
        }
        return
      }
      if (typeof value !== "string") {
        throw new Error(
          `フィールド "${key}" は文字列または文字列配列である必要があります`,
        )
      }
      return
    }
  }

  private validateNumberRange(
    key: string,
    value: number,
    config: NumberPropertyConfig,
  ): void {
    if (config.min !== undefined && value < config.min) {
      throw new Error(
        `フィールド "${key}" は ${config.min} 以上である必要があります`,
      )
    }
    if (config.max !== undefined && value > config.max) {
      throw new Error(
        `フィールド "${key}" は ${config.max} 以下である必要があります`,
      )
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
