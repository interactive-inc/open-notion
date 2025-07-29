# Relation

Links to other database entries.

## Schema Definition

```typescript
{
  project: { type: 'relation' },
  relatedTasks: { type: 'relation' }  // Can be multiple
}
```

## TypeScript Type

```typescript
string[] | undefined  // Array of page IDs
```

## Writing

```typescript
await table.create({
  project: ['project-page-id'],
  relatedTasks: ['task-1-id', 'task-2-id']
})

await table.update('page-id', {
  project: ['new-project-id']
})
```

## Querying

```typescript
// Contains specific relation
await table.findMany({
  where: { 
    project: { $contains: 'project-id' }
  }
})

// Available operators
$contains      // Contains page ID
$contains_any  // Contains any of page IDs
$contains_all  // Contains all page IDs
$is_empty      // No relations
$is_not_empty  // Has relations
```

## Examples

```typescript
const tasksTable = new NotionTable({
  client,
  tableId: 'tasks-db',
  schema: {
    title: { type: 'title', required: true },
    project: { type: 'relation' },
    blockedBy: { type: 'relation' },
    relatedTasks: { type: 'relation' }
  }
})

// Create task with relations
const task = await tasksTable.create({
  title: 'Implement authentication',
  project: ['project-123'],
  blockedBy: ['task-456'],
  relatedTasks: ['task-789', 'task-101']
})

// Find tasks in project
const projectTasks = await tasksTable.findMany({
  where: { 
    project: { $contains: 'project-123' }
  }
})

// Find blocked tasks
const blockedTasks = await tasksTable.findMany({
  where: { 
    blockedBy: { $is_not_empty: true }
  }
})

// Find tasks with specific relations
const related = await tasksTable.findMany({
  where: { 
    relatedTasks: { $contains_any: ['task-789', 'task-101'] }
  }
})
```