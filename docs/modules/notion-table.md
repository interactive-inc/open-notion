# NotionTable

The main class for database operations with type-safe schema support.

## Import

```typescript
import { NotionTable } from '@interactive-inc/notion-client'
```

## Constructor

```typescript
new NotionTable<TSchema>({
  client: Client,
  tableId: string,
  schema: TSchema,
  enhancer?: NotionMarkdown,
  hooks?: TableHooks<TSchema>
})
```

### Parameters

- `client` - Notion API client instance
- `tableId` - Database ID from Notion
- `schema` - Type-safe schema definition
- `enhancer` - Optional markdown transformer
- `hooks` - Optional lifecycle hooks

## Basic Usage

```typescript
import { Client } from '@notionhq/client'
import { NotionTable } from '@interactive-inc/notion-client'

const client = new Client({ auth: process.env.NOTION_TOKEN })

const tasksTable = new NotionTable({
  client,
  tableId: 'your-database-id',
  schema: {
    title: { type: 'title', required: true },
    status: { type: 'select', options: ['todo', 'done'] as const },
    priority: { type: 'number', min: 1, max: 10 }
  } as const
})
```

## CRUD Operations

### Create

```typescript
const task = await tasksTable.create({
  title: 'New Task',
  status: 'todo',
  priority: 5
})

// With markdown body
const page = await tasksTable.create({
  title: 'Documentation',
  body: `# Overview\n\nThis is **markdown** content.`
})
```

### Read

```typescript
// Find many
const { records, hasMore, nextCursor } = await tasksTable.findMany({
  where: { status: 'todo' },
  sorts: [{ property: 'priority', direction: 'descending' }],
  limit: 20
})

// Find one
const task = await tasksTable.findOne({
  where: { title: 'Important Task' }
})

// Find by ID
const specific = await tasksTable.findById('page-id')
```

### Update

```typescript
// Update single
const updated = await tasksTable.update('page-id', {
  status: 'done'
})

// Update many
const count = await tasksTable.updateMany({
  where: { status: 'todo' },
  data: { status: 'in_progress' }
})

// Upsert
const result = await tasksTable.upsert({
  where: { email: 'user@example.com' },
  create: { name: 'New User', email: 'user@example.com' },
  update: { lastSeen: new Date().toISOString() }
})
```

### Delete

```typescript
// Soft delete (archive)
await tasksTable.delete('page-id')

// Delete many
const deletedCount = await tasksTable.deleteMany({
  where: { status: 'cancelled' }
})

// Restore
await tasksTable.restore('page-id')
```

## Advanced Features

### With Markdown Enhancement

```typescript
import { NotionMarkdown } from '@interactive-inc/notion-client'

const enhancer = new NotionMarkdown({
  heading_1: 'heading_2',  // H1 → H2
  heading_2: 'heading_3'   // H2 → H3
})

const docsTable = new NotionTable({
  client,
  tableId: 'docs-db',
  schema: { title: { type: 'title', required: true } },
  enhancer
})
```

### With Lifecycle Hooks

```typescript
const ordersTable = new NotionTable({
  client,
  tableId: 'orders-db',
  schema: {
    orderNumber: { type: 'title', required: true },
    total: { type: 'number' }
  },
  hooks: {
    beforeCreate: async (data) => {
      // Generate order number
      return {
        ...data,
        orderNumber: `ORD-${Date.now()}`
      }
    },
    afterCreate: async (record) => {
      console.log('Order created:', record.orderNumber)
      return record
    },
    beforeUpdate: async (id, data) => {
      // Validate updates
      if (data.total && data.total < 0) {
        throw new Error('Total cannot be negative')
      }
      return data
    },
    afterFind: async (records) => {
      // Add computed fields
      return records.map(r => ({
        ...r,
        formattedTotal: `$${r.total.toFixed(2)}`
      }))
    }
  }
})
```

### Query Operators

```typescript
// Comparison
{ price: { $gte: 100 } }
{ quantity: { $lt: 10 } }

// String matching
{ name: { $contains: 'product' } }
{ email: { $ends_with: '@company.com' } }

// Array operations
{ tags: { $contains: 'urgent' } }
{ categories: { $contains_any: ['electronics', 'books'] } }

// Logical
{ $or: [{ status: 'active' }, { priority: { $gte: 8 } }] }
{ $and: [{ published: true }, { featured: true }] }
{ $not: { status: 'archived' } }

// Empty checks
{ description: { $is_empty: true } }
{ tags: { $is_not_empty: true } }
```

## Type Safety

```typescript
// Schema defines types
const schema = {
  name: { type: 'title', required: true },
  age: { type: 'number' },
  tags: { type: 'multi_select', options: ['a', 'b', 'c'] as const }
} as const

// Type is inferred
type User = InferSchemaType<typeof schema>
// {
//   id: string
//   name: string
//   age?: number
//   tags?: ('a' | 'b' | 'c')[]
// }

// Full IDE support
const table = new NotionTable({ client, tableId, schema })
const user = await table.create({
  name: 'John',     // ✅ Required
  age: 30,          // ✅ Optional number
  tags: ['a', 'b']  // ✅ Array of valid options
})
```

## Error Handling

```typescript
try {
  await table.create({ 
    // Missing required field
    status: 'todo' 
  })
} catch (error) {
  // ValidationError: title is required
}

try {
  await table.findById('invalid-id')
} catch (error) {
  // NotFoundError: Page not found
}
```