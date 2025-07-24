export class NotionMemoryCache {
  private cache = new Map<string, unknown>()

  get<T>(key: string): T | null {
    const value = this.cache.get(key)
    if (value === undefined) {
      return null
    }
    return value as T
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value)
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // キャッシュサイズを取得（デバッグ用）
  get size(): number {
    return this.cache.size
  }
}
