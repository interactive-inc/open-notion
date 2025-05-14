import { readdirSync } from "node:fs"

const config = {
  output: {
    windsurf: false,
    cline: true,
    claude: true,
    devin: false,
    augment: false,
  },
}

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

if (config.output.cline) {
  await writeTextFile(markdown, ".clinerules")
}

if (config.output.claude) {
  await writeTextFile(markdown, "CLAUDE.md")
}

if (config.output.windsurf) {
  await writeTextFile(markdown, ".windsurfrules")
}

if (config.output.augment) {
  await writeTextFile(markdown, ".augment-guidelines")
}

if (config.output.devin) {
  await writeTextFile(markdown, "devin.md")
}

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
