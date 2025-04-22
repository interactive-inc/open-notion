import { toNotionBlocks } from "../lib"

const mdText = await Bun.file("samples/markdown.md").text()

const blocks = toNotionBlocks(mdText)

const text = JSON.stringify(blocks, null, 2)

await Bun.write("samples/notion-blocks.json", text)
