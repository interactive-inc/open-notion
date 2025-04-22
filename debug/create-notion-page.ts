import { Client } from "@notionhq/client"
import { toNotionBlocks } from "../lib"

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const mdText = await Bun.file("samples/markdown.md").text()

const children = toNotionBlocks(mdText)

const page = await notion.pages.create({
  parent: {
    page_id: "1d8842f961818048a638ff01c586c605",
  },
  properties: {},
  children: children,
})

console.log(page)
