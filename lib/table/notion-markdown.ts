export type BlockTypeMapping = {
  heading_1?: string
  heading_2?: string
  heading_3?: string
  paragraph?: string
  bulleted_list_item?: string
  numbered_list_item?: string
  code?: string
  quote?: string
  callout?: string
  toggle?: string
  divider?: string
}

export class NotionMarkdown {
  private blockTypeMapping: BlockTypeMapping

  constructor(blockTypeMapping: BlockTypeMapping = {}) {
    this.blockTypeMapping = blockTypeMapping
  }

  enhanceBlockType(originalType: string): string {
    const mapping = this.blockTypeMapping as Record<string, string | undefined>
    return mapping[originalType] || originalType
  }

  setMapping(blockTypeMapping: BlockTypeMapping): void {
    this.blockTypeMapping = blockTypeMapping
  }

  getMapping(): BlockTypeMapping {
    return { ...this.blockTypeMapping }
  }
}
