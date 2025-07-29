# Select

Single choice from predefined options.

## Schema Definition

```typescript
{
  status: { 
    type: 'select', 
    options: ['todo', 'in_progress', 'done'] as const,
    required: true  // Optional
  }
}
```

Use `as const` to preserve literal types.

## TypeScript Type

```typescript
'todo' | 'in_progress' | 'done' | undefined
// or just 'todo' | 'in_progress' | 'done' if required
```

## Writing

```typescript
await table.create({
  status: 'todo'  // Auto-completes options
})

await table.update('page-id', {
  status: 'done'
})
```

## Querying

```typescript
// Exact match
await table.findMany({
  where: { status: 'done' }
})

// Multiple values
await table.findMany({
  where: { 
    status: { $in: ['todo', 'in_progress'] }
  }
})

// Available operators
$eq           // Equals (default)
$ne           // Not equals
$in           // In array
$is_empty     // No selection
$is_not_empty // Has selection
```

## Examples

```typescript
const tasksTable = new NotionTable({
  client,
  tableId: 'tasks-db',
  schema: {
    title: { type: 'title', required: true },
    status: { 
      type: 'select', 
      options: ['backlog', 'todo', 'in_progress', 'review', 'done'] as const
    },
    priority: {
      type: 'select',
      options: ['low', 'medium', 'high', 'urgent'] as const,
      required: true
    }
  }
})

// Create with select values
const task = await tasksTable.create({
  title: 'Implement auth',
  status: 'todo',
  priority: 'high'
})

// Query by status
const activeTasks = await tasksTable.findMany({
  where: { 
    status: { $in: ['todo', 'in_progress'] },
    priority: { $ne: 'low' }
  }
})
```