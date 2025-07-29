# Type Safety

Get full TypeScript auto-completion from your schema definitions.

## Auto-completion

Define a schema once and get IDE auto-completion everywhere:

```typescript
const taskSchema = {
  title: { type: 'title', required: true },
  status: { type: 'select', options: ['todo', 'in_progress', 'done'] as const },
  priority: { type: 'number', min: 1, max: 10 },
  tags: { type: 'multi_select', options: ['bug', 'feature', 'docs'] as const }
} as const

const tasksTable = new NotionTable({
  client,
  tableId: 'tasks-db',
  schema: taskSchema
})

// IDE auto-completes all properties and values
await tasksTable.create({
  title: 'Fix login bug',        // ✅ Required field
  status: 'in_progress',         // ✅ Auto-completes: 'todo' | 'in_progress' | 'done'
  priority: 5,                   // ✅ Number type
  tags: ['bug']                  // ✅ Auto-completes: 'bug' | 'feature' | 'docs'
})
```

## Type Inference

The schema automatically generates TypeScript types:

```typescript
type Task = InferSchemaType<typeof taskSchema>
// {
//   id: string
//   title: string
//   status?: 'todo' | 'in_progress' | 'done'
//   priority?: number
//   tags?: ('bug' | 'feature' | 'docs')[]
// }
```

## Query Auto-completion

Queries also benefit from full type support:

```typescript
// IDE knows all available fields and operators
const results = await tasksTable.findMany({
  where: {
    status: 'done',              // ✅ Auto-completes valid options
    priority: { $gte: 5 },       // ✅ Number operators available
    tags: { $contains: 'bug' }   // ✅ Array operators available
  },
  sorts: [
    { property: 'priority', direction: 'descending' }  // ✅ Auto-completes properties
  ]
})

// Results are fully typed
results.records.forEach(task => {
  console.log(task.title)        // string
  console.log(task.status)       // 'todo' | 'in_progress' | 'done' | undefined
})
```

## Compile-time Validation

TypeScript catches errors before runtime:

```typescript
await tasksTable.create({
  // ❌ Error: Missing required property 'title'
  status: 'pending'              // ❌ Error: 'pending' is not a valid option
})

// Update operations have all fields optional
await tasksTable.update('task-id', {
  status: 'done'                 // ✅ Auto-completes valid options
})
```

## VS Code Integration

![VS Code Auto-completion](https://example.com/vscode-demo.gif)

- Property names auto-complete as you type
- Hover for type information
- Red squiggles for type errors
- IntelliSense for all methods and options

## Best Practice

Always use `as const` for literal types:

```typescript
// ✅ Correct - preserves literal types
const schema = {
  status: { 
    type: 'select', 
    options: ['active', 'inactive'] as const 
  }
} as const

// ❌ Wrong - loses type information
const schema = {
  status: { 
    type: 'select', 
    options: ['active', 'inactive']  // Just string[]
  }
}
```