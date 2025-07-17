A TypeScript library that transforms Notion into a powerful, type-safe database. Seamlessly convert between Notion blocks and markdown, while enjoying simple database operations without the complexity of Notion's API.

## Use Notion as a Database

Working directly with Notion's API can be overwhelming. The API responses include extensive formatting information like text colors, bold/italic styles, annotations, and deeply nested metadata structures. What should be a simple database query becomes a complex parsing exercise.

For example, retrieving a simple text value requires navigating through multiple nested objects:
```json
{
  "properties": {
    "Name": {
      "id": "title",
      "type": "title",
      "title": [{
        "type": "text",
        "text": { "content": "Hello World" },
        "annotations": { "bold": false, "italic": false, "color": "default" },
        "plain_text": "Hello World"
      }]
    }
  }
}
```

Open Notion simplifies this to just `{ name: "Hello World" }`, making Notion as easy to use as any traditional database.

## Features

- **Bidirectional Conversion**: Convert between Notion blocks and markdown text
- **Type-safe Database Operations**: Strongly-typed CRUD operations for Notion databases
- **Block Type Support**: Supports paragraphs, headings (H1-H3), lists, and code blocks
- **Rich Text Formatting**: Handles bold, italic, strikethrough, and inline code
- **Recursive Block Fetching**: Automatically fetches nested child blocks
- **Advanced Querying**: Filter, sort, and paginate database queries

## Installation

```bash
bun i @interactive-inc/notion-client
```

## Usage

### Converting Notion Blocks to Markdown

```typescript
import { fromNotionBlocks } from '@interactive-inc/notion-client'

const blocks = await fetchNotionBlocks() // Your Notion blocks
const markdown = fromNotionBlocks(blocks)
```

### Converting Markdown to Notion Blocks

```typescript
import { toNotionBlocks } from '@interactive-inc/notion-client'

const markdown = `# Hello World
This is a paragraph with **bold** text.`

const blocks = toNotionBlocks(markdown)
```

### Type-safe Database Operations

```typescript
import { Client } from '@notionhq/client'
import { defineSchema, defineTable } from '@interactive-inc/notion-client'

// Define your database schema
const schema = defineSchema({
  title: { type: 'title', required: true },
  status: { type: 'select', options: ['todo', 'in_progress', 'done'] },
  priority: { type: 'number' },
  tags: { type: 'multi_select', options: ['bug', 'feature', 'enhancement'] }
})

// Create a type-safe table client
const notion = new Client({ auth: process.env.NOTION_API_KEY })
const tasksTable = defineTable({
  notion,
  tableId: 'your-database-id',
  schema
})

// Create a record
const task = await tasksTable.create({
  title: 'Implement new feature',
  status: 'todo',
  priority: 1,
  tags: ['feature']
})

// Query records with filtering and sorting
const { records } = await tasksTable.findMany({
  where: { status: 'in_progress' },
  sorts: { field: 'priority', direction: 'desc' },
  count: 10
})

// Update a record
await tasksTable.update(task.id, {
  status: 'done'
})
```

### Enhanced Block Fetching

```typescript
import { enhance } from '@interactive-inc/notion-client'

// Create an enhanced client that fetches all child blocks recursively
const enhancedClient = enhance(notion.blocks.children.list)

const blocksWithChildren = await enhancedClient({
  block_id: 'page-id'
})
```

## Supported Block Types

### Notion to Markdown
- Paragraph blocks
- Heading 1, 2, 3 blocks
- Bulleted list items
- Numbered list items
- Code blocks

### Markdown to Notion
- Paragraphs
- Headings (H1-H3)
- Bulleted lists (with nesting)
- Numbered lists (with nesting)
- Code blocks
- Text formatting: bold, italic, strikethrough, inline code

## API Reference

### Block Conversion

- `fromNotionBlock(block: NotionBlock): string` - Convert a single Notion block to markdown
- `fromNotionBlocks(blocks: NotionBlock[]): string` - Convert multiple Notion blocks to markdown
- `toNotionBlocks(markdown: string): BlockObjectRequest[]` - Convert markdown to Notion blocks

### Database Operations

- `defineSchema(schema: Schema): Schema` - Define a database schema
- `defineTable(options: TableOptions): Table` - Create a type-safe table client

### Table Methods

- `findMany(options?: FindOptions)` - Query multiple records
- `findOne(options?: FindOptions)` - Find the first matching record
- `findById(id: string)` - Get a record by ID
- `create(data: Partial<SchemaType>)` - Create a new record
- `update(id: string, data: Partial<SchemaType>)` - Update a record
- `updateMany(options: UpdateManyOptions)` - Update multiple records
- `upsert(options: UpsertOptions)` - Create or update a record
- `delete(id: string)` - Archive a record
- `deleteMany(where?: WhereCondition)` - Archive multiple records
- `restore(id: string)` - Restore an archived record
