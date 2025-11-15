# Mutation

Learn how to create and update records in Notion databases.

## Creating Records

### Basic Creation

Create a new record with required fields:

```typescript
const task = await tasksTable.create({
  properties: {
    title: 'Complete documentation',
    status: 'in_progress',
    priority: 5
  }
})

console.log(task.id) // Notion page ID
```

### With Markdown Content

Add rich text content using markdown:

```typescript
const blogPost = await blogTable.create({
  properties: {
    title: 'Getting Started with notion-client'
  },
  body: `# Introduction

This library makes working with Notion databases **simple** and *intuitive*.

## Features
- Type-safe operations
- Markdown support
- Advanced queries

\`\`\`typescript
const table = new NotionTable({ ... })
\`\`\`
`
})
```

## Updating Records

### Update by ID

Update specific fields of a record:

```typescript
const updated = await tasksTable.update('page-id', {
  status: 'completed',
  completedAt: new Date().toISOString()
})
```

### Update with Markdown

Update content while preserving formatting:

```typescript
const updated = await blogTable.update(postId, {
  body: `# Updated Title

New content with **bold** text.

- Updated list item 1
- Updated list item 2
`
})
```

### Update Many

Bulk update multiple records:

```typescript
// Mark all high-priority tasks as urgent
const count = await tasksTable.updateMany({
  where: { priority: { $gte: 8 } },
  data: { status: 'urgent' }
})

console.log(`Updated ${count} tasks`)
```

## Upsert Operations

Create or update based on conditions:

```typescript
const contact = await contactsTable.upsert({
  where: { email: 'john@example.com' },
  create: {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp'
  },
  update: {
    lastContacted: new Date().toISOString()
  }
})
```

## Using Hooks

### Before Create

Transform data before saving:

```typescript
const articlesTable = new NotionTable({
  client,
  dataSourceId: 'articles-db',
  properties: {
    title: { type: 'title' },
    slug: { type: 'rich_text' },
    publishedAt: { type: 'date' }
  },
  hooks: {
    beforeCreate: async (data) => {
      // Auto-generate slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      
      return {
        ...data,
        slug,
        publishedAt: data.publishedAt || new Date().toISOString()
      }
    }
  }
})

const article = await articlesTable.create({
  title: 'My First Article!'
})
// Automatically gets slug: 'my-first-article'
```

### After Update

Perform actions after updates:

```typescript
const ordersTable = new NotionTable({
  client,
  dataSourceId: 'orders-db',
  properties: {
    orderNumber: { type: 'title' },
    status: { type: 'select', options: ['pending', 'shipped', 'delivered'] },
    customerEmail: { type: 'email' }
  },
  hooks: {
    afterUpdate: async (record) => {
      if (record.status === 'shipped') {
        // Send notification email
        await sendEmail(record.customerEmail, 'Your order has shipped!')
      }
      return record
    }
  }
})
```

## Markdown Enhancement

Transform heading levels for consistency:

```typescript
const docsTable = new NotionTable({
  client,
  dataSourceId: 'docs-db',
  properties: {
    title: { type: 'title' }
  },
  enhancer: new NotionMarkdown({
    heading_1: 'heading_2', // Convert all H1 to H2
    heading_2: 'heading_3'  // Convert all H2 to H3
  })
})

await docsTable.create({
  title: 'API Guide',
  body: `# Main Title
  
## Subsection

Content here.`
})
// In Notion: H1 becomes H2, H2 becomes H3
```

## Batch Operations

### Bulk Creation

Create multiple records efficiently:

```typescript
const tasks = [
  { title: 'Task 1', priority: 5 },
  { title: 'Task 2', priority: 3 },
  { title: 'Task 3', priority: 8 }
]

const created = await Promise.all(
  tasks.map(task => tasksTable.create(task))
)
```

### Transaction-like Updates

Ensure consistency with error handling:

```typescript
async function transferTask(fromUserId: string, toUserId: string, taskId: string) {
  try {
    // Remove from original user
    await userTasksTable.update(fromUserId, {
      taskIds: { $remove: taskId }
    })
    
    // Add to new user
    await userTasksTable.update(toUserId, {
      taskIds: { $add: taskId }
    })
    
    // Update task owner
    await tasksTable.update(taskId, {
      ownerId: toUserId
    })
  } catch (error) {
    // Handle rollback logic
    throw new Error(`Transfer failed: ${error.message}`)
  }
}
```

## Best Practices

### Input Validation

Always validate before database operations:

```typescript
function validateTaskInput(data: any) {
  if (!data.title || data.title.length < 3) {
    throw new Error('Title must be at least 3 characters')
  }
  
  if (data.priority && (data.priority < 1 || data.priority > 10)) {
    throw new Error('Priority must be between 1 and 10')
  }
}

// Use before creation
validateTaskInput(input)
const task = await tasksTable.create(input)
```

### Error Handling

Provide clear error messages:

```typescript
try {
  await tasksTable.create({
    // Missing required title
    priority: 5
  })
} catch (error) {
  if (error.message.includes('required')) {
    console.error('Please provide all required fields')
  } else {
    console.error('Failed to create task:', error.message)
  }
}
```