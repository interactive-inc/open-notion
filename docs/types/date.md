# Date

Date and optional time values.

## Schema Definition

```typescript
{
  createdAt: { type: 'date' },
  deadline: { type: 'date' }
}
```

## TypeScript Type

```typescript
string | undefined  // ISO 8601 format
// or just string if required
```

## Writing

```typescript
await table.create({
  createdAt: '2024-01-15',
  deadline: '2024-12-31T23:59:59Z'
})

// Using Date object
await table.create({
  deadline: new Date('2024-12-31').toISOString()
})
```

## Querying

```typescript
// Date comparisons
await table.findMany({
  where: { 
    deadline: { $gte: '2024-01-01' }
  }
})

// Available operators
$eq           // Equals
$ne           // Not equals
$before       // Before date
$after        // After date
$on_or_before // On or before
$on_or_after  // On or after
$is_empty     // No date
$is_not_empty // Has date
```

## Examples

```typescript
const eventsTable = new NotionTable({
  client,
  tableId: 'events-db',
  schema: {
    title: { type: 'title' },
    startDate: { type: 'date' },
    endDate: { type: 'date' },
    registrationDeadline: { type: 'date' }
  }
})

// Create event
const event = await eventsTable.create({
  title: 'Tech Conference 2024',
  startDate: '2024-06-15',
  endDate: '2024-06-17',
  registrationDeadline: '2024-06-01'
})

// Find upcoming events
const upcoming = await eventsTable.findMany({
  where: { 
    startDate: { $after: new Date().toISOString() }
  },
  sorts: [{ property: 'startDate', direction: 'ascending' }]
})

// Find events this month
const thisMonth = await eventsTable.findMany({
  where: { 
    startDate: { 
      $on_or_after: '2024-01-01',
      $before: '2024-02-01'
    }
  }
})
```