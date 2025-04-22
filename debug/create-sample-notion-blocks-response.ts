import { Client } from "@notionhq/client"
import { enhance } from "../lib/enhance"

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const blocks = await enhance(notion.blocks.children.list)({
  block_id: "1d8842f9618180428c77d5c2f6cb333b",
})

const text = JSON.stringify(blocks, null, 2)

await Bun.write("samples/notion-blocks-response.json", text)
