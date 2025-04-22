import { lexer } from "marked"

const mdText = await Bun.file("test/sample-markdown.md").text()

const nodes = lexer(mdText)

const text = JSON.stringify(nodes, null, 2)

await Bun.write("samples/markdown-tokens.json", text)
