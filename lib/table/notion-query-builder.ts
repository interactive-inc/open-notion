import type {
  DateRange,
  FormulaPropertyConfig,
  QueryOperator,
  Schema,
  SortOption,
  WhereCondition,
} from "./types"

export class NotionQueryBuilder {
  buildFilter<T extends Schema>(
    schema: T,
    where: WhereCondition<T>,
  ): Record<string, unknown> | undefined {
    const conditions: Array<Record<string, unknown>> = []

    // $or条件の処理
    if (
      "$or" in where &&
      where.$or &&
      Array.isArray(where.$or) &&
      where.$or.length > 0
    ) {
      const orConditions = where.$or
        .map((condition) => this.buildFilter(schema, condition))
        .filter(
          (filter): filter is Record<string, unknown> => filter !== undefined,
        )
      if (orConditions.length === 1) {
        return orConditions[0]
      }
      if (orConditions.length > 1) {
        return { or: orConditions }
      }
      return {}
    }

    // $and条件の処理
    if (
      "$and" in where &&
      where.$and &&
      Array.isArray(where.$and) &&
      where.$and.length > 0
    ) {
      const andConditions = where.$and
        .map((condition) => this.buildFilter(schema, condition))
        .filter(
          (filter): filter is Record<string, unknown> => filter !== undefined,
        )
      conditions.push(...andConditions)
    }

    // 通常のフィールド条件の処理
    for (const [key, value] of Object.entries(where)) {
      if (key === "$or" || key === "$and") {
        continue
      }

      const config = schema[key]
      if (!config) {
        continue
      }

      if (this.isQueryOperator(value)) {
        const operatorConditions = this.buildOperatorCondition(
          key,
          value,
          config,
        )
        conditions.push(...operatorConditions)
      } else if (value !== undefined) {
        const simpleCondition = this.buildSimpleCondition(key, value, config)
        if (simpleCondition) {
          conditions.push(simpleCondition)
        }
      }
    }

    if (conditions.length === 0) {
      return {}
    }

    if (conditions.length === 1) {
      return conditions[0]
    }

    return conditions.length > 0 ? { and: conditions } : {}
  }

  buildSort<T extends Schema>(
    sorts: SortOption<T>[],
  ): Array<Record<string, unknown>> {
    return sorts.map((sort) => ({
      property: String(sort.field),
      direction: sort.direction === "asc" ? "ascending" : "descending",
    }))
  }

  private isQueryOperator(value: unknown): value is QueryOperator<unknown> {
    if (!value || typeof value !== "object") {
      return false
    }
    const operators = [
      "$eq",
      "$ne",
      "$gt",
      "$gte",
      "$lt",
      "$lte",
      "$in",
      "$contains",
    ]
    return Object.keys(value).some((key) => operators.includes(key))
  }

  private buildOperatorCondition(
    key: string,
    operators: QueryOperator<unknown>,
    config: { type: string },
  ): Array<Record<string, unknown>> {
    const conditions: Array<Record<string, unknown>> = []

    for (const [operator, value] of Object.entries(operators)) {
      if (value === undefined) {
        continue
      }

      if (operator === "$eq") {
        const condition = this.buildSimpleCondition(key, value, config)
        if (condition) {
          conditions.push(condition)
        }
        continue
      }

      if (operator === "$ne") {
        if (config.type === "select" || config.type === "status") {
          conditions.push({
            property: key,
            [config.type]: { does_not_equal: value },
          })
        }
        continue
      }

      if (operator === "$gt") {
        if (config.type === "number") {
          conditions.push({
            property: key,
            number: { greater_than: value },
          })
          continue
        }
        if (config.type === "date") {
          conditions.push({
            property: key,
            date: { after: this.getDateString(value) },
          })
        }
        continue
      }

      if (operator === "$gte") {
        if (config.type === "number") {
          conditions.push({
            property: key,
            number: { greater_than_or_equal_to: value },
          })
          continue
        }
        if (config.type === "date") {
          conditions.push({
            property: key,
            date: { on_or_after: this.getDateString(value) },
          })
        }
        continue
      }

      if (operator === "$lt") {
        if (config.type === "number") {
          conditions.push({
            property: key,
            number: { less_than: value },
          })
          continue
        }
        if (config.type === "date") {
          conditions.push({
            property: key,
            date: { before: this.getDateString(value) },
          })
        }
        continue
      }

      if (operator === "$lte") {
        if (config.type === "number") {
          conditions.push({
            property: key,
            number: { less_than_or_equal_to: value },
          })
          continue
        }
        if (config.type === "date") {
          conditions.push({
            property: key,
            date: { on_or_before: this.getDateString(value) },
          })
        }
        continue
      }

      if (operator === "$in" && Array.isArray(value)) {
        if (config.type === "select" || config.type === "status") {
          const orConditions = value.map((v) => ({
            property: key,
            [config.type]: { equals: v },
          }))
          if (orConditions.length > 1) {
            conditions.push({ or: orConditions })
            continue
          }
          if (orConditions.length === 1 && orConditions[0]) {
            conditions.push(orConditions[0])
          }
        }
        continue
      }

      if (operator === "$contains") {
        if (config.type === "title" || config.type === "rich_text") {
          conditions.push({
            property: key,
            [config.type]: { contains: value },
          })
          continue
        }
        if (config.type === "multi_select") {
          conditions.push({
            property: key,
            multi_select: { contains: value },
          })
        }
      }
    }

    return conditions
  }

  private buildSimpleCondition(
    key: string,
    value: unknown,
    config: { type: string },
  ): Record<string, unknown> | null {
    if (config.type === "title") {
      return {
        property: key,
        title: { contains: String(value) },
      }
    }

    if (config.type === "rich_text") {
      return {
        property: key,
        rich_text: { contains: String(value) },
      }
    }

    if (config.type === "number") {
      if (typeof value === "number") {
        return {
          property: key,
          number: { equals: value },
        }
      }
      return null
    }

    if (config.type === "select" || config.type === "status") {
      if (typeof value === "string") {
        return {
          property: key,
          [config.type]: { equals: value },
        }
      }
      return null
    }

    if (config.type === "multi_select") {
      if (typeof value === "string") {
        return {
          property: key,
          multi_select: { contains: value },
        }
      }
      if (Array.isArray(value) && value.length > 0) {
        return {
          property: key,
          multi_select: { contains: value[0] },
        }
      }
      return null
    }

    if (config.type === "date") {
      return {
        property: key,
        date: { on: this.getDateString(value) },
      }
    }

    if (config.type === "checkbox") {
      return {
        property: key,
        checkbox: { equals: Boolean(value) },
      }
    }

    if (config.type === "relation") {
      if (typeof value === "string") {
        return {
          property: key,
          relation: { contains: value },
        }
      }
      return null
    }

    if (config.type === "formula") {
      const formulaConfig = config as FormulaPropertyConfig
      if (formulaConfig.formulaType === "string" && typeof value === "string") {
        return {
          property: key,
          formula: { string: { equals: value } },
        }
      }
      if (formulaConfig.formulaType === "number" && typeof value === "number") {
        return {
          property: key,
          formula: { number: { equals: value } },
        }
      }
      if (
        formulaConfig.formulaType === "boolean" &&
        typeof value === "boolean"
      ) {
        return {
          property: key,
          formula: { boolean: { equals: value } },
        }
      }
      if (formulaConfig.formulaType === "date") {
        return {
          property: key,
          formula: { date: { on: this.getDateString(value) } },
        }
      }
      return null
    }

    return null
  }

  private getDateString(value: unknown): string {
    if (value && typeof value === "object" && "start" in value) {
      const dateRange = value as DateRange
      if (dateRange.start) {
        const parts = dateRange.start.split("T")
        return parts[0] || dateRange.start
      }
    }
    if (value instanceof Date) {
      const isoString = value.toISOString()
      const parts = isoString.split("T")
      return parts[0] || isoString
    }
    if (typeof value === "string" && value) {
      const parts = value.split("T")
      return parts[0] || value
    }
    const today = new Date().toISOString()
    const parts = today.split("T")
    return parts[0] || today
  }
}
