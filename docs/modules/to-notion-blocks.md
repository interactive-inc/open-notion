# toNotionBlocks

Convert markdown text to Notion block objects.

## Import

```typescript
import { toNotionBlocks } from '@interactive-inc/notion-client'
```

## Function Signature

```typescript
async function toNotionBlocks(
  markdown: string,
  enhancer?: NotionMarkdown
): Promise<NotionBlock[]>
```

## Supported Markdown

### Headings

| Markdown | Notion Block | Example |
|----------|--------------|---------|
| `# ` | `heading_1` | `# Title` |
| `## ` | `heading_2` | `## Section` |
| `### ` | `heading_3` | `### Subsection` |
| `#### ` and below | `heading_3` | `#### Details` → H3 |

```typescript
const markdown = `# Main Title
## Section
### Subsection`

const blocks = await toNotionBlocks(markdown)
// [
//   { type: 'heading_1', heading_1: { rich_text: [...] } },
//   { type: 'heading_2', heading_2: { rich_text: [...] } },
//   { type: 'heading_3', heading_3: { rich_text: [...] } }
// ]
```

### Paragraphs

| Markdown | Notion Block |
|----------|--------------|
| Plain text | `paragraph` |

```typescript
const markdown = `This is a paragraph.

This is another paragraph.`

const blocks = await toNotionBlocks(markdown)
// [
//   { type: 'paragraph', paragraph: { rich_text: [...] } },
//   { type: 'paragraph', paragraph: { rich_text: [...] } }
// ]
```

### Lists

| Markdown | Notion Block | Example |
|----------|--------------|---------|
| `- `, `* `, `+ ` | `bulleted_list_item` | `- Item` |
| `1. `, `2. `, etc. | `numbered_list_item` | `1. First` |

```typescript
const markdown = `- First bullet
- Second bullet
  - Nested bullet

1. First number
2. Second number`

const blocks = await toNotionBlocks(markdown)
// Bullets and numbered lists with proper nesting
```

### Code Blocks

| Markdown | Notion Block |
|----------|--------------|
| ` ```lang ` | `code` with language |
| ` ``` ` | `code` without language |

```typescript
const markdown = `\`\`\`typescript
const hello = "world"
console.log(hello)
\`\`\``

const blocks = await toNotionBlocks(markdown)
// [{
//   type: 'code',
//   code: {
//     rich_text: [{ text: { content: 'const hello = "world"\nconsole.log(hello)' } }],
//     language: 'typescript'
//   }
// }]
```

### Inline Formatting

| Markdown | Notion Annotation | Example |
|----------|------------------|---------|
| `**text**` | `bold: true` | `**Bold text**` |
| `*text*` or `_text_` | `italic: true` | `*Italic text*` |
| `~~text~~` | `strikethrough: true` | `~~Strikethrough~~` |
| `` `text` `` | `code: true` | `` `inline code` `` |

```typescript
const markdown = `This has **bold**, *italic*, ~~strike~~, and \`code\`.`

const blocks = await toNotionBlocks(markdown)
// Paragraph with rich text annotations
```

## Complex Examples

### Full Document

```typescript
const markdown = `# Project Documentation

This project uses **TypeScript** and *React*.

## Installation

Run the following command:

\`\`\`bash
npm install
\`\`\`

## Features

- Type safety
- Hot reload
- Modern tooling

### Configuration

1. Copy the example file
2. Update settings
3. Restart server`

const blocks = await toNotionBlocks(markdown)
// Complete Notion block structure
```

### With Enhancement

```typescript
import { NotionMarkdown, toNotionBlocks } from '@interactive-inc/notion-client'

const enhancer = new NotionMarkdown({
  heading_1: 'heading_2',  // # becomes ##
  heading_2: 'heading_3'   // ## becomes ###
})

const markdown = `# Title
## Subtitle`

const blocks = await toNotionBlocks(markdown, enhancer)
// Title is heading_2, Subtitle is heading_3
```

### Nested Lists

```typescript
const markdown = `- Parent item
  - Child item
    - Grandchild item
  - Another child
- Back to parent`

const blocks = await toNotionBlocks(markdown)
// Creates proper parent-child relationships
```

## Limitations

### Unsupported Markdown

The following markdown features are not supported:

| Feature | Behavior |
|---------|----------|
| Tables | Converted to paragraph |
| Images `![alt](url)` | Converted to paragraph with text |
| Links `[text](url)` | Only text is preserved |
| Blockquotes `> ` | Converted to paragraph |
| Horizontal rules `---` | Ignored |
| HTML tags | Stripped or escaped |

### Markdown Variants

- Only CommonMark and GitHub Flavored Markdown are supported
- Custom markdown extensions are not supported
- Indented code blocks (4 spaces) are treated as paragraphs

## Usage with NotionTable

```typescript
const blogTable = new NotionTable({
  client,
  tableId: 'blog-db',
  schema: {
    title: { type: 'title', required: true }
  }
})

// Create page with markdown content
const post = await blogTable.create({
  title: 'My Blog Post',
  body: `# Introduction

This is my **awesome** blog post about \`TypeScript\`.

## Main Points

1. Type safety is important
2. Developer experience matters
3. Performance is key

\`\`\`typescript
interface User {
  name: string
  email: string
}
\`\`\`

## Conclusion

Thanks for reading!`
})
```

## Best Practices

### Escape Special Characters

```typescript
// Escape backticks in inline code
const markdown = 'Use \\`console.log()\\` to debug'

// Escape asterisks if not formatting
const markdown = 'Multiply 5 \\* 10'
```

### Handle Empty Lines

```typescript
const markdown = `Paragraph one


Paragraph two`  // Multiple empty lines

const blocks = await toNotionBlocks(markdown)
// Only creates two paragraph blocks
```

### Language Detection

```typescript
// Specify language for syntax highlighting
const markdown = `\`\`\`javascript
// JavaScript code
\`\`\`

\`\`\`python
# Python code
\`\`\`

\`\`\`
// No language specified
\`\`\``
```

## Performance Tips

### Batch Processing

```typescript
// Process large documents in chunks
const chunks = markdown.split('\n\n')
const blockArrays = await Promise.all(
  chunks.map(chunk => toNotionBlocks(chunk))
)
const allBlocks = blockArrays.flat()
```

### Caching

```typescript
// Cache converted blocks for repeated use
const cache = new Map()

async function getCachedBlocks(markdown: string) {
  if (cache.has(markdown)) {
    return cache.get(markdown)
  }
  
  const blocks = await toNotionBlocks(markdown)
  cache.set(markdown, blocks)
  return blocks
}
```