import fs from "node:fs/promises"
import config from "./config.json"

await updateCopilotInstructions()
await updateEditorRule()
await updateCursorRules()
await updateVscodeSettings()
await updateDevinRule()

function extractFrontmatter(markdownText: string): {
  description: string
  globs: string
  alwaysApply: string
} {
  const result = {
    description: "",
    globs: "",
    alwaysApply: "",
  }

  const frontmatterRegex = /^---\n([\s\S]*?)\n---/

  const match = markdownText.match(frontmatterRegex)

  if (!match) {
    return result
  }

  const [, frontmatter] = match

  const texts = frontmatter.split("\n")

  for (const line of texts) {
    const colonIndex = line.indexOf(":")
    if (colonIndex === -1) {
      continue
    }

    const key = line.substring(0, colonIndex).trim()
    const value = line.substring(colonIndex + 1).trim()

    if (key === "description") {
      result.description = value
    }

    if (key === "globs") {
      result.globs = value
    }

    if (key === "alwaysApply") {
      result.alwaysApply = value
    }
  }

  return result
}

function extractMarkdownTitle(text: string): string | null {
  const match = text.match(/^# (.+)$/m)

  return match ? match[1] : null
}

function createFrontmatter(props: {
  description: string
  globs: string
  alwaysApply: boolean
}): string {
  return `---
description: ${props.description}
globs: ${props.globs}
alwaysApply: ${props.alwaysApply}
---`
}

async function createRulesInstructions(props: {
  rulesPath: string
}) {
  let markdown = ""

  const rules = await readMdcRules(props.rulesPath)

  if (rules.length === 0) {
    return ""
  }

  markdown = "# Rule files\n\n"

  markdown +=
    "If you find anything below that matches your purpose, read the file indicated in the 'read' section for reference.\n"

  markdown += "\n"

  for (const rule of rules) {
    markdown += `## ${rule.description || "-"}\n\n`
    markdown += `- target: \`${rule.globs}\`\n`
    markdown += `- read: \`${rule.path}\`\n`
    markdown += "\n"
  }

  markdown = `${markdown.trim()}\n`

  markdown += "\n"

  return markdown
}

async function readMdcRules(rulesPath: string): Promise<
  (ReturnType<typeof extractFrontmatter> & {
    path: string
  })[]
> {
  const glob = new Bun.Glob("*.mdc")

  const rules: (ReturnType<typeof extractFrontmatter> & {
    path: string
  })[] = []

  for await (const file of glob.scan(rulesPath)) {
    const path = `${rulesPath}/${file}`
    const content = await Bun.file(path).text()
    const frontmatter = extractFrontmatter(content)
    // if (frontmatter.alwaysApply === "true") continue
    rules.push({ ...frontmatter, path: path })
  }

  return rules
}

async function readTextFile(...filePath: string[]): Promise<string> {
  const contentPath = `${process.cwd()}/${filePath.join("/")}`

  const content = await Bun.file(contentPath).text()

  return content.replace(/\n{3,}/g, "\n\n").trim()
}

async function* readTextFiles(...paths: string[]) {
  const directoryPath = [process.cwd(), ...paths].join("/")

  const files = await fs.readdir(directoryPath)

  for (const file of files) {
    const filePath = `${directoryPath}/${file}`

    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) continue

    const text = await Bun.file(filePath).text()

    const content = `${text.trim()}\n`

    yield [file, content] as const
  }
}

function removeFrontmatter(markdownText: string): string {
  if (markdownText.length === 0) {
    return markdownText
  }

  const frontmatterRegex = /^---\r?\n[\s\S]*?\r?\n---\r?\n/

  const result = markdownText.replace(frontmatterRegex, "")

  return result.trim()
}

async function writeTextFile(
  content: string,
  ...filePath: string[]
): Promise<null> {
  const contentPath = `${process.cwd()}/${filePath.join("/")}`

  await Bun.write(contentPath, content)

  return null
}

async function updateCopilotInstructions() {
  let markdown = ""

  const rules = Object.values([
    config.instructions.overview,
    config.instructions.workflow,
    config.instructions.output,
    config.instructions.test,
    config.instructions.code,
    config.instructions.architecture,
    config.instructions.development,
    config.instructions.restriction,
  ])

  for (const path of rules) {
    if (path === null) continue
    markdown += await readTextFile(path)
    markdown += "\n\n"
  }

  markdown += await createRulesInstructions({ rulesPath: config.input.rules })

  markdown = `${markdown.trim()}\n`

  await writeTextFile(markdown, config.output.copilotInstructions)

  const instructions = [
    {
      path: config.output.copilotInstructionsCommitMessageGeneration,
      files: [config.instructions.commitMessage],
    },
    {
      path: config.output.copilotInstructionsPullRequestDescriptionGeneration,
      files: [config.instructions.pullRequestDescription],
    },
    {
      path: config.output.copilotInstructionsReviewSelection,
      files: [config.instructions.review],
    },
    {
      path: config.output.copilotInstructionsTestGeneration,
      files: [config.instructions.test],
    },
  ]

  for (const instruction of instructions) {
    const rules = Object.values(instruction.files)

    let markdown = ""

    for (const path of rules) {
      markdown += await readTextFile(path)
      markdown += "\n\n"
    }

    markdown = `${markdown.trim()}\n`

    await writeTextFile(markdown, instruction.path)
  }
}

async function updateCursorRules() {
  const files = Object.values(config.instructions)

  let markdown = createFrontmatter({
    description: "Instructions",
    globs: "",
    alwaysApply: true,
  })

  markdown += "\n"

  for await (const file of files) {
    if (file === null) continue
    markdown += await readTextFile(file)
    markdown += "\n\n"
  }

  markdown = `${markdown.trim()}\n`

  await writeTextFile(markdown, config.output.cursorRules, "instructions.mdc")

  const rules = readTextFiles(config.input.rules)

  for await (const [path, text] of rules) {
    await writeTextFile(text, config.output.cursorRules, path)
  }
}

async function updateDevinRule() {
  if (config.output.devin === null) return

  let markdown = ""

  const instructions = [
    config.instructions.overview,
    config.instructions.workflow,
    config.instructions.output,
    config.instructions.test,
    config.instructions.code,
    config.instructions.architecture,
    config.instructions.development,
    config.instructions.restriction,
  ]

  for (const path of instructions) {
    if (path === null) continue
    markdown += await readTextFile(path)
    markdown += "\n\n"
  }

  markdown = `${markdown.trim()}\n`

  await writeTextFile(markdown, config.output.devin)
}

async function updateEditorRule() {
  let markdown = ""

  markdown += "\n"

  const instructions = [
    config.instructions.overview,
    config.instructions.workflow,
    config.instructions.output,
    config.instructions.commitMessage,
    config.instructions.pullRequestDescription,
    config.instructions.review,
    config.instructions.test,
    config.instructions.code,
    config.instructions.architecture,
    config.instructions.development,
    config.instructions.restriction,
  ]

  for (const path of instructions) {
    if (path === null) continue
    markdown += await readTextFile(path)
    markdown += "\n\n"
  }

  markdown = `${markdown.trim()}\n\n`

  markdown += await createRulesInstructions({ rulesPath: config.input.rules })

  if (config.output.clinerules) {
    await writeTextFile(markdown, config.output.clinerules)
  }

  if (config.output.claude) {
    await writeTextFile(markdown, config.output.claude)
  }

  if (config.output.windsurfrules) {
    await writeTextFile(markdown, config.output.windsurfrules)
  }
}

async function updateVscodeSettings() {
  const settingsJson = await readTextFile(".vscode", "settings.json")

  const settings = {
    ...JSON.parse(settingsJson),
    "github.copilot.chat.commitMessageGeneration.instructions": [
      {
        file: `${config.output.copilotInstructionsCommitMessageGeneration}`,
      },
    ],
    "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
      {
        file: `${config.output.copilotInstructionsPullRequestDescriptionGeneration}`,
      },
    ],
    "github.copilot.chat.reviewSelection.instructions": [
      {
        file: `${config.output.copilotInstructionsReviewSelection}`,
      },
    ],
    "github.copilot.chat.testGeneration.instructions": [
      {
        file: `${config.output.copilotInstructionsTestGeneration}`,
      },
    ],
  }

  const text = `${JSON.stringify(settings, null, 2)}\n`

  await writeTextFile(text, ".vscode", "settings.json")
}
