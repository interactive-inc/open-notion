import { NotionTable } from "./notion-table"
import type {
  NotionConverterInterface,
  NotionMemoeryCacheInterface,
  NotionQueryBuilderInterface,
  Schema,
  TableOptions,
  ValidatorInterface,
} from "./types"

/**
 * テーブル作成関数
 **/
export function defineTable<T extends Schema>(
  options: TableOptions<T> & {
    cache?: NotionMemoeryCacheInterface
    validator?: ValidatorInterface
    queryBuilder?: NotionQueryBuilderInterface
    converter?: NotionConverterInterface
  },
): NotionTable<T> {
  return new NotionTable({
    client: options.notion,
    tableId: options.tableId,
    schema: options.schema,
    cache: options.cache,
    validator: options.validator,
    queryBuilder: options.queryBuilder,
    converter: options.converter,
  })
}
