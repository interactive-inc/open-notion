import type { NumberPropertyConfig, PropertyConfig, Schema } from "@/types"

export class NotionSchemaValidator {
  validate<T extends Schema>(
    schema: T,
    data: unknown,
    options?: { skipRequired?: boolean },
  ): void {
    if (!data || typeof data !== "object") {
      throw new Error("Data must be an object")
    }

    const dataObj = data as Record<string, unknown>

    for (const [key, config] of Object.entries(schema)) {
      const value = dataObj[key]

      // Required field check (skip for partial updates)
      if (
        !options?.skipRequired &&
        config.required &&
        (value === undefined || value === null)
      ) {
        throw new Error(`Required field "${key}" is missing`)
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
    // 型別のバリデーション
    if (config.type === "title" || config.type === "rich_text") {
      if (typeof value !== "string") {
        throw new Error(`Field "${key}" must be a string`)
      }
      return
    }

    if (config.type === "number") {
      if (typeof value !== "number") {
        throw new Error(`Field "${key}" must be a number`)
      }
      this.validateNumberRange(key, value, config)
      return
    }

    if (config.type === "select" || config.type === "status") {
      if (typeof value !== "string") {
        throw new Error(`Field "${key}" must be a string`)
      }
      if (!config.options.includes(value)) {
        throw new Error(
          `Field "${key}" value "${value}" is not allowed. Allowed values: ${config.options.join(", ")}`,
        )
      }
      return
    }

    if (config.type === "multi_select") {
      if (!Array.isArray(value)) {
        throw new Error(`Field "${key}" must be an array`)
      }
      if (config.options !== null) {
        for (const item of value) {
          if (!config.options.includes(item)) {
            throw new Error(
              `Field "${key}" value "${item}" is not allowed. Allowed values: ${config.options.join(", ")}`,
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
          throw new Error(`Field "${key}" start date must be a string`)
        }
        if (dateRange.end !== null && typeof dateRange.end !== "string") {
          throw new Error(`Field "${key}" end date must be a string or null`)
        }
        return
      }
      if (!(value instanceof Date)) {
        throw new Error(
          `Field "${key}" must be a Date object or DateRange type`,
        )
      }
      return
    }

    if (config.type === "people" || config.type === "files") {
      if (!Array.isArray(value)) {
        throw new Error(`Field "${key}" must be an array`)
      }
      return
    }

    if (config.type === "checkbox") {
      if (typeof value !== "boolean") {
        throw new Error(`Field "${key}" must be a boolean`)
      }
      return
    }

    if (config.type === "url") {
      if (typeof value !== "string") {
        throw new Error(`Field "${key}" must be a string`)
      }
      if (value && !this.isValidUrl(value)) {
        throw new Error(`Field "${key}" must be a valid URL`)
      }
      return
    }

    if (config.type === "email") {
      if (typeof value !== "string") {
        throw new Error(`Field "${key}" must be a string`)
      }
      if (value && !this.isValidEmail(value)) {
        throw new Error(`Field "${key}" must be a valid email address`)
      }
      return
    }

    if (config.type === "phone_number") {
      if (typeof value !== "string") {
        throw new Error(`Field "${key}" must be a string`)
      }
      return
    }

    if (config.type === "relation") {
      if (Array.isArray(value)) {
        for (const id of value) {
          if (typeof id !== "string") {
            throw new Error(`Field "${key}" relation IDs must be strings`)
          }
        }
        return
      }
      if (typeof value !== "string") {
        throw new Error(`Field "${key}" must be a string or string array`)
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
      throw new Error(`Field "${key}" must be at least ${config.min}`)
    }
    if (config.max !== undefined && value > config.max) {
      throw new Error(`Field "${key}" must be at most ${config.max}`)
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
