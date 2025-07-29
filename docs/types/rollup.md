# Rollup

Aggregated values from related entries (read-only).

## Schema Definition

```typescript
{
  taskCount: { type: 'rollup' },
  totalHours: { type: 'rollup' }
}
```

## TypeScript Type

```typescript
string | number | boolean | undefined  // Depends on rollup type
```

## Writing

Rollup fields aggregate data from relations and cannot be written directly.

```typescript
// ❌ Cannot set rollup values
await table.create({
  taskCount: 5  // This will be ignored
})

// ✅ Rollups update automatically based on relations
await table.create({
  relatedTasks: ['task-1', 'task-2', 'task-3']
  // taskCount rollup will show 3
})
```

## Querying

```typescript
// Query aggregated values
await table.findMany({
  where: { 
    taskCount: { $gte: 5 }
  }
})

// Available operators depend on rollup type
// Count/Sum: $eq, $ne, $gt, $gte, $lt, $lte
// Average: $eq, $ne, $gt, $gte, $lt, $lte
// Show original: depends on original field type
```

## Examples

```typescript
const projectsTable = new NotionTable({
  client,
  tableId: 'projects-db',
  schema: {
    name: { type: 'title', required: true },
    tasks: { type: 'relation' },
    taskCount: { type: 'rollup' },  // Count of related tasks
    totalHours: { type: 'rollup' },  // Sum of task hours
    avgPriority: { type: 'rollup' },  // Average task priority
    completedCount: { type: 'rollup' }  // Count where status = done
  }
})

// Rollups calculate automatically from relations
const project = await projectsTable.findById('project-123')
console.log(project.taskCount)     // e.g., 15
console.log(project.totalHours)    // e.g., 120
console.log(project.avgPriority)   // e.g., 7.5

// Query by rollup values
const largeProjects = await projectsTable.findMany({
  where: { 
    taskCount: { $gte: 10 }
  }
})

const timeIntensive = await projectsTable.findMany({
  where: { 
    totalHours: { $gt: 100 }
  }
})

// Team example with member stats
const teamsTable = new NotionTable({
  schema: {
    name: { type: 'title', required: true },
    members: { type: 'relation' },
    memberCount: { type: 'rollup' },  // Count
    avgExperience: { type: 'rollup' },  // Average years
    totalCapacity: { type: 'rollup' }  // Sum of capacity
  }
})

// Find teams by size
const largeTeams = await teamsTable.findMany({
  where: { 
    memberCount: { $gte: 10 }
  }
})
```