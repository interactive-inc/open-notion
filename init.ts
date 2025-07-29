import { readdirSync } from "node:fs"

let markdown = ""

markdown += "\n"

const instructionDir = ".github/instructions"

const instructionFiles = readdirSync(instructionDir)
  .filter((file) => file.endsWith(".instructions.md"))
  .sort()
  .map((file) => `${instructionDir}/${file}`)

for (const path of instructionFiles) {
  const text = await readTextFile(path)
  markdown += removeFrontMatter(text)
  markdown += "\n\n"
}

markdown = `${markdown.trim()}\n\n`

await writeTextFile(markdown, ".clinerules")

await writeTextFile(markdown, "CLAUDE.md")

async function readTextFile(...filePath: string[]): Promise<string> {
  const contentPath = `${process.cwd()}/${filePath.join("/")}`

  const content = await Bun.file(contentPath).text()

  return content.replace(/\n{3,}/g, "\n\n").trim()
}

async function writeTextFile(
  content: string,
  ...filePath: string[]
): Promise<null> {
  const contentPath = `${process.cwd()}/${filePath.join("/")}`

  await Bun.write(contentPath, content)

  return null
}

function removeFrontMatter(text: string): string {
  const lines = text.split("\n")

  const frontMatterStartIndex = lines.findIndex((line) => line === "---")

  if (frontMatterStartIndex === -1) {
    return text
  }

  const frontMatterEndIndex = lines.findIndex(
    (line, index) => index > frontMatterStartIndex && line === "---",
  )

  if (frontMatterEndIndex === -1) {
    return text
  }

  const contentLines = lines.slice(frontMatterEndIndex + 1)
  return contentLines.join("\n").trim()
}
