import type { NotionBlock, NotionPage } from "@/types"

export class NotionMemoryCache {
  private pages = new Map<string, NotionPage>()

  private blocks = new Map<string, NotionBlock[]>()

  getPage(id: string): NotionPage | null {
    const value = this.pages.get(id)
    if (value === undefined) {
      return null
    }
    return value
  }

  setPage(id: string, page: NotionPage): void {
    this.pages.set(id, page)
  }

  deletePage(id: string): void {
    this.pages.delete(id)
  }

  getBlocks(id: string): NotionBlock[] | null {
    const value = this.blocks.get(id)
    if (value === undefined) {
      return null
    }
    return value
  }

  setBlocks(id: string, blocks: NotionBlock[]): void {
    this.blocks.set(id, blocks)
  }

  deleteBlocks(id: string): void {
    this.blocks.delete(id)
  }

  clear(): void {
    this.pages.clear()
    this.blocks.clear()
  }
}
