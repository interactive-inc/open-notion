# Multi-Select

Multiple choices from predefined options.

## Schema Definition

```typescript
{
  tags: { 
    type: 'multi_select', 
    options: ['bug', 'feature', 'docs', 'urgent'] as const
  }
}
```

## TypeScript Type

```typescript
('bug' | 'feature' | 'docs' | 'urgent')[] | undefined
```

## Writing

```typescript
await table.create({
  tags: ['bug', 'urgent']  // Array of options
})

await table.update('page-id', {
  tags: ['feature']  // Replace all tags
})
```

## Querying

```typescript
// Contains specific tag
await table.findMany({
  where: { 
    tags: { $contains: 'bug' }
  }
})

// Contains any of these tags
await table.findMany({
  where: { 
    tags: { $contains_any: ['bug', 'urgent'] }
  }
})

// Available operators
$contains      // Contains specific value
$contains_any  // Contains any of values
$contains_all  // Contains all values
$is_empty      // No tags
$is_not_empty  // Has tags
```

## Examples

```typescript
const issuesTable = new NotionTable({
  client,
  tableId: 'issues-db',
  schema: {
    title: { type: 'title' },
    tags: { 
      type: 'multi_select', 
      options: ['bug', 'feature', 'enhancement', 'docs', 'urgent', 'blocked'] as const
    },
    labels: {
      type: 'multi_select',
      options: ['frontend', 'backend', 'database', 'api'] as const
    }
  }
})

// Create issue with multiple tags
const issue = await issuesTable.create({
  title: 'Login button not working',
  tags: ['bug', 'urgent'],
  labels: ['frontend']
})

// Find urgent bugs
const urgentBugs = await issuesTable.findMany({
  where: { 
    tags: { $contains_all: ['bug', 'urgent'] }
  }
})

// Find frontend or backend issues
const techIssues = await issuesTable.findMany({
  where: {
    labels: { $contains_any: ['frontend', 'backend'] }
  }
})
```