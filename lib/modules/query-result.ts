import type { PageReference } from "./page-reference"

type Props<T> = {
  readonly pageReferences: PageReference<T>[]
  readonly cursor: string | null
  readonly hasMore: boolean
}

/**
 * データベースクエリの結果を表すクラス
 */
export class QueryResult<T> {
  constructor(private readonly props: Props<T>) {
    Object.freeze(this)
  }

  /**
   * 取得したページ参照の配列
   */
  pageReferences(): PageReference<T>[] {
    return this.props.pageReferences
  }

  /**
   * 次のページを取得するためのカーソル
   */
  cursor(): string | null {
    return this.props.cursor
  }

  /**
   * さらにページがあるかどうか
   */
  hasMore(): boolean {
    return this.props.hasMore
  }

  /**
   * 取得したページ数
   */
  length(): number {
    return this.props.pageReferences.length
  }
}
