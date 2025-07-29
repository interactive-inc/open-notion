import type {
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints"
import type { NotionBlock } from "@/types"

type Client = (
  args: ListBlockChildrenParameters,
) => Promise<ListBlockChildrenResponse>

/**
 * Recursively fetch child blocks for a given block
 */
export function enhance(client: Client) {
  const fn = async (
    args: ListBlockChildrenParameters,
  ): Promise<NotionBlock[]> => {
    const response = await client(args)

    const blocks = response.results.map((block) => {
      const hasType = "type" in block

      if (hasType === false) {
        throw new Error("Block type is not defined")
      }

      return {
        ...block,
        children: [],
      }
    })

    const results: NotionBlock[] = []

    for (const block of blocks) {
      if (block.has_children === false) {
        results.push(block)
        continue
      }

      const childBlocks = await fn({ block_id: block.id })

      const hasType = "type" in block

      if (hasType === false) {
        throw new Error("Block type is not defined")
      }

      results.push({
        ...block,
        children: childBlocks,
      })
    }

    return results
  }

  return fn
}
