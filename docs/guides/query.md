# Query

Learn how to query and retrieve data from Notion databases.

## Basic Setup

First, create a NotionTable instance with your schema:

```typescript
import { NotionTable } from '@interactive-inc/notion-client'
import { Client } from '@notionhq/client'

const client = new Client({ auth: process.env.NOTION_TOKEN })

const contactsTable = new NotionTable({
  client,
  tableId: 'your-database-id',
  schema: {
    name: { type: 'title', required: true },
    email: { type: 'email' },
    company: { type: 'select', options: ['Apple', 'Google', 'Microsoft'] },
    active: { type: 'checkbox' }
  }
})
```

## Finding Records

### Find Many

Retrieve multiple records with optional filtering:

```typescript
// Get all records
const { records } = await contactsTable.findMany()

// With filtering
const { records } = await contactsTable.findMany({
  where: { active: true }
})

// With pagination
const { records, hasMore, nextCursor } = await contactsTable.findMany({
  limit: 10
})

// Next page
const nextPage = await contactsTable.findMany({
  limit: 10,
  cursor: nextCursor
})
```

### Find One

Get the first matching record:

```typescript
const contact = await contactsTable.findOne({
  where: { email: 'john@example.com' }
})

if (contact) {
  console.log(contact.name)
}
```

### Find by ID

Retrieve a specific record by Notion page ID:

```typescript
const contact = await contactsTable.findById('page-id-here')
```

## Advanced Queries

### Comparison Operators

```typescript
// Greater than
const highPriority = await tasksTable.findMany({
  where: { priority: { $gte: 8 } }
})

// Not equal
const activeTasks = await tasksTable.findMany({
  where: { status: { $ne: 'completed' } }
})

// Range query
const mediumPriority = await tasksTable.findMany({
  where: {
    priority: { $gte: 4, $lte: 7 }
  }
})
```

### String Operators

```typescript
// Contains
const results = await contactsTable.findMany({
  where: { name: { $contains: 'John' } }
})

// Starts with
const results = await contactsTable.findMany({
  where: { email: { $starts_with: 'admin@' } }
})
```

### Logical Operators

```typescript
// OR query
const results = await tasksTable.findMany({
  where: {
    $or: [
      { status: 'urgent' },
      { priority: { $gte: 9 } }
    ]
  }
})

// Complex AND/OR
const results = await tasksTable.findMany({
  where: {
    $and: [
      { active: true },
      {
        $or: [
          { priority: { $gte: 8 } },
          { tags: { $contains: 'important' } }
        ]
      }
    ]
  }
})
```

## Sorting Results

```typescript
// Single sort
const results = await tasksTable.findMany({
  sorts: [{ property: 'priority', direction: 'descending' }]
})

// Multiple sorts
const results = await contactsTable.findMany({
  sorts: [
    { property: 'company', direction: 'ascending' },
    { property: 'name', direction: 'ascending' }
  ]
})
```

## Working with Hooks

Transform data after retrieval:

```typescript
const productsTable = new NotionTable({
  client,
  tableId: 'products-db-id',
  schema: {
    name: { type: 'title', required: true },
    price: { type: 'number' }
  },
  hooks: {
    afterFind: async (records) => {
      // Add computed field
      return records.map(record => ({
        ...record,
        formattedPrice: `$${record.price.toFixed(2)}`
      }))
    }
  }
})

const products = await productsTable.findMany()
// Each product now has formattedPrice
```

## Performance Tips

### Use Specific Queries

```typescript
// Good: Specific query
const active = await table.findMany({
  where: { status: 'active' },
  limit: 20
})

// Avoid: Fetching all then filtering
const all = await table.findMany()
const active = all.records.filter(r => r.status === 'active')
```

### Implement Caching

```typescript
import { NotionMemoryCache } from '@interactive-inc/notion-client'

const cache = new NotionMemoryCache({ ttl: 300000 }) // 5 minutes

// Check cache first
const cached = cache.get('active-tasks')
if (cached) return cached

// Fetch and cache
const results = await tasksTable.findMany({
  where: { status: 'active' }
})
cache.set('active-tasks', results)
```

## Error Handling

```typescript
try {
  const contact = await contactsTable.findById('invalid-id')
} catch (error) {
  if (error.message.includes('not found')) {
    console.log('Contact does not exist')
  }
}
```