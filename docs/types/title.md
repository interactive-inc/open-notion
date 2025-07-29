# Title

The required primary field for every Notion database.

## Schema Definition

```typescript
{
  title: { type: 'title', required: true }
}
```

Every database must have exactly one title property.

## TypeScript Type

```typescript
string  // Always required
```

## Writing

```typescript
await table.create({
  title: 'Project Alpha'
})

await table.update('page-id', {
  title: 'Project Beta'
})
```

## Querying

```typescript
// Exact match
await table.findMany({
  where: { title: 'Project Alpha' }
})

// String operators
await table.findMany({
  where: { 
    title: { $contains: 'Project' }
  }
})

// Available operators
$contains     // Contains substring
$starts_with  // Starts with string
$ends_with    // Ends with string
$is_empty     // Is empty
$is_not_empty // Is not empty
```

## Examples

```typescript
const projectsTable = new NotionTable({
  client,
  tableId: 'projects-db',
  schema: {
    title: { type: 'title', required: true },
    description: { type: 'rich_text' }
  }
})

// Create project
const project = await projectsTable.create({
  title: 'Website Redesign',
  description: 'Complete overhaul of company website'
})

// Find by title
const found = await projectsTable.findOne({
  where: { title: { $contains: 'Website' } }
})
```