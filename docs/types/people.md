# People

User references for assigning and mentioning.

## Schema Definition

```typescript
{
  assignee: { type: 'people' },
  reviewers: { type: 'people' }  // Can be multiple users
}
```

## TypeScript Type

```typescript
string[] | undefined  // Array of user IDs
```

## Writing

```typescript
await table.create({
  assignee: ['user-id-1'],
  reviewers: ['user-id-1', 'user-id-2']
})

await table.update('page-id', {
  assignee: ['new-user-id']
})
```

## Querying

```typescript
// Contains specific user
await table.findMany({
  where: { 
    assignee: { $contains: 'user-id-1' }
  }
})

// Available operators
$contains      // Contains user ID
$contains_any  // Contains any of user IDs
$contains_all  // Contains all user IDs
$is_empty      // No users assigned
$is_not_empty  // Has users assigned
```

## Examples

```typescript
const tasksTable = new NotionTable({
  client,
  tableId: 'tasks-db',
  schema: {
    title: { type: 'title', required: true },
    assignee: { type: 'people' },
    reviewers: { type: 'people' },
    watchers: { type: 'people' }
  }
})

// Create task with assignee
const task = await tasksTable.create({
  title: 'Review PR #123',
  assignee: ['user-123'],
  reviewers: ['user-456', 'user-789']
})

// Find tasks assigned to user
const myTasks = await tasksTable.findMany({
  where: { 
    assignee: { $contains: 'user-123' }
  }
})

// Find unassigned tasks
const unassigned = await tasksTable.findMany({
  where: { 
    assignee: { $is_empty: true }
  }
})

// Find tasks needing review
const needsReview = await tasksTable.findMany({
  where: { 
    reviewers: { $contains_any: ['user-456', 'user-789'] }
  }
})
```