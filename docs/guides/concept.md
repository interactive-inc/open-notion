# Concept

Understanding how notion-client simplifies Notion's complex API.

## The Problem with Notion's API

Notion's API is powerful but returns deeply nested, verbose JSON structures that are difficult to work with.

### Example: Getting a Simple Text Value

With standard Notion API:

```typescript
// Fetch page
const page = await notion.pages.retrieve({ page_id: 'xxx' })

// Extract a simple title
const title = page.properties.Title.title[0].plain_text
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//            Deep nesting required for simple value!

// Full response structure:
{
  "object": "page",
  "id": "xxx",
  "properties": {
    "Title": {
      "id": "title",
      "type": "title",
      "title": [{
        "type": "text",
        "text": {
          "content": "My Task",
          "link": null
        },
        "annotations": {
          "bold": false,
          "italic": false,
          "strikethrough": false,
          "underline": false,
          "code": false,
          "color": "default"
        },
        "plain_text": "My Task",
        "href": null
      }]
    }
  }
}
```

With notion-client:

```typescript
// Fetch record
const task = await tasksTable.findById('xxx')

// Access value directly
const title = task.title
//            ^^^^^^^^^^
//            Direct access!

// Clean response:
{
  "id": "xxx",
  "title": "My Task"
}
```

## Real-World Comparison

### Creating a Task

**Standard Notion API:**

```typescript
const response = await notion.pages.create({
  parent: { database_id: 'database-id' },
  properties: {
    Title: {
      title: [{
        text: {
          content: 'Complete project'
        }
      }]
    },
    Status: {
      select: {
        name: 'In Progress'
      }
    },
    Priority: {
      number: 5
    },
    Tags: {
      multi_select: [
        { name: 'urgent' },
        { name: 'frontend' }
      ]
    }
  }
})
```

**notion-client:**

```typescript
const task = await tasksTable.create({
  title: 'Complete project',
  status: 'In Progress',
  priority: 5,
  tags: ['urgent', 'frontend']
})
```

### Querying with Filters

**Standard Notion API:**

```typescript
const response = await notion.databases.query({
  database_id: 'database-id',
  filter: {
    and: [
      {
        property: 'Status',
        select: {
          does_not_equal: 'Done'
        }
      },
      {
        property: 'Priority',
        number: {
          greater_than_or_equal_to: 5
        }
      }
    ]
  },
  sorts: [{
    property: 'Priority',
    direction: 'descending'
  }]
})

// Extract data from each page
const tasks = response.results.map(page => ({
  id: page.id,
  title: page.properties.Title.title[0]?.plain_text || '',
  status: page.properties.Status.select?.name,
  priority: page.properties.Priority.number
}))
```

**notion-client:**

```typescript
const { records } = await tasksTable.findMany({
  where: {
    status: { $ne: 'Done' },
    priority: { $gte: 5 }
  },
  sorts: [{ property: 'priority', direction: 'descending' }]
})

// Data is already clean and typed
```

## Complex Properties Simplified

### Multi-Select

**Standard Notion API:**

```typescript
// Setting multi-select
{
  properties: {
    Tags: {
      multi_select: [
        { name: 'bug' },
        { name: 'critical' }
      ]
    }
  }
}

// Reading multi-select
const tags = page.properties.Tags.multi_select.map(tag => tag.name)
```

**notion-client:**

```typescript
// Setting
{ tags: ['bug', 'critical'] }

// Reading - already an array
const tags = record.tags // ['bug', 'critical']
```

### People

**Standard Notion API:**

```typescript
// Setting people
{
  properties: {
    Assignee: {
      people: [
        { object: 'user', id: 'user-id-1' },
        { object: 'user', id: 'user-id-2' }
      ]
    }
  }
}

// Reading people
const assignees = page.properties.Assignee.people.map(person => person.id)
```

**notion-client:**

```typescript
// Setting
{ assignee: ['user-id-1', 'user-id-2'] }

// Reading
const assignees = record.assignee // ['user-id-1', 'user-id-2']
```

### Rich Text with Formatting

**Standard Notion API:**

```typescript
{
  properties: {
    Description: {
      rich_text: [{
        type: 'text',
        text: { content: 'This is ' }
      }, {
        type: 'text',
        text: { content: 'bold' },
        annotations: { bold: true }
      }, {
        type: 'text',
        text: { content: ' text' }
      }]
    }
  }
}
```

**notion-client with markdown:**

```typescript
{
  description: 'This is **bold** text'
}
```

## Benefits Summary

### 1. Reduced Complexity

- **Before**: Navigate 4-5 levels of nesting
- **After**: Direct property access

### 2. Type Safety

```typescript
// notion-client provides full TypeScript support
const task = await tasksTable.create({
  title: 'Task',        // ✅ Required
  status: 'todo',       // ✅ Auto-completes valid options
  priority: 'high'      // ❌ Type error: must be number
})
```

### 3. Cleaner Code

```typescript
// Standard Notion API
if (page.properties.Status.select?.name === 'Done' && 
    page.properties.Priority.number >= 5) {
  // ...
}

// notion-client
if (task.status === 'Done' && task.priority >= 5) {
  // ...
}
```

### 4. Consistent Interface

All property types follow the same pattern:

```typescript
// Always simple values
{
  title: string,
  number: number,
  checkbox: boolean,
  select: string,
  multiSelect: string[],
  date: string,
  people: string[],
  // etc...
}
```

## When to Use notion-client

✅ **Use notion-client when:**
- Building CRUD applications with Notion as database
- Need type-safe operations
- Want clean, maintainable code
- Working with structured data

❌ **Use standard API when:**
- Need low-level control
- Working with blocks directly
- Building Notion extensions
- Need features not yet supported

## Migration Example

Converting existing Notion API code:

```typescript
// Before: Standard Notion API
async function getTasks() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID
  })
  
  return response.results.map(page => ({
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || '',
    status: page.properties.Status.select?.name || 'todo',
    tags: page.properties.Tags.multi_select.map(t => t.name)
  }))
}

// After: notion-client
async function getTasks() {
  const { records } = await tasksTable.findMany()
  return records
}
```

The complexity is hidden, letting you focus on your application logic.