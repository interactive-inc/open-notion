import type { Schema, SortOption, WhereCondition } from "@/types"
import { toNotionQuery } from "./to-notion-query"

export class NotionQueryBuilder {
  buildFilter<T extends Schema>(
    schema: T,
    where: WhereCondition<T>,
  ): Record<string, unknown> | undefined {
    return toNotionQuery(schema, where) as Record<string, unknown> | undefined
  }

  buildSort<T extends Schema>(
    sorts: SortOption<T>[],
  ): Array<Record<string, unknown>> {
    return sorts.map((sort) => ({
      property: String(sort.field),
      direction: sort.direction === "asc" ? "ascending" : "descending",
    }))
  }
}
