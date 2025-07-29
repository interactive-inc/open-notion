# Schema Definition

Learn how to define type-safe schemas for your Notion databases.

## Basic Schema

Define your database structure with TypeScript:

```typescript
const schema = {
  title: { type: 'title', required: true },
  description: { type: 'rich_text' },
  priority: { type: 'number' },
  status: { type: 'select', options: ['todo', 'in_progress', 'done'] }
} as const
```

## Property Types

### Title

Every Notion database must have exactly one title property:

```typescript
{
  title: { type: 'title', required: true }
}
```

### Text Properties

```typescript
{
  // Rich text with formatting support
  description: { type: 'rich_text' },
  
  // URL validation
  website: { type: 'url', required: true },
  
  // Email validation
  email: { type: 'email' },
  
  // Phone number format
  phone: { type: 'phone_number' }
}
```

### Number Properties

```typescript
{
  // Basic number
  price: { type: 'number' },
  
  // With validation
  age: { 
    type: 'number',
    min: 0,
    max: 150,
    required: true
  },
  
  // Custom validation
  rating: {
    type: 'number',
    validate: (value) => {
      if (value % 0.5 !== 0) {
        return 'Rating must be in 0.5 increments'
      }
      return true
    }
  }
}
```

### Select Properties

```typescript
{
  // Single select with options
  category: {
    type: 'select',
    options: ['bug', 'feature', 'enhancement'] as const,
    required: true
  },
  
  // Multi-select
  tags: {
    type: 'multi_select',
    options: ['urgent', 'blocked', 'needs-review'] as const
  }
}
```

### Date Properties

```typescript
{
  // Simple date
  createdAt: { type: 'date' },
  
  // Required date
  deadline: { type: 'date', required: true }
}
```

### Other Properties

```typescript
{
  // Boolean
  isActive: { type: 'checkbox' },
  
  // User references
  assignee: { type: 'people' },
  
  // File attachments
  attachments: { type: 'files' },
  
  // Relations to other databases
  project: { type: 'relation' },
  
  // Computed values
  total: { type: 'formula' },
  
  // Aggregated from relations
  taskCount: { type: 'rollup' }
}
```

## Type Inference

The schema automatically infers TypeScript types:

```typescript
const taskSchema = {
  title: { type: 'title', required: true },
  priority: { type: 'number' },
  tags: { type: 'multi_select', options: ['bug', 'feature'] }
} as const

type Task = InferSchemaType<typeof taskSchema>
// {
//   id: string
//   title: string
//   priority?: number
//   tags?: ('bug' | 'feature')[]
// }
```

## Validation

### Built-in Validation

```typescript
const productSchema = {
  name: { type: 'title', required: true },
  price: { 
    type: 'number', 
    required: true,
    min: 0 
  },
  stock: { 
    type: 'number',
    min: 0,
    max: 10000
  }
} as const
```

### Custom Validators

```typescript
const userSchema = {
  username: {
    type: 'title',
    required: true,
    validate: (value) => {
      if (value.length < 3) {
        return 'Username must be at least 3 characters'
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Username can only contain letters, numbers, and underscores'
      }
      return true
    }
  },
  email: {
    type: 'email',
    required: true,
    validate: async (value) => {
      // Async validation
      const exists = await checkEmailExists(value)
      if (exists) {
        return 'Email already registered'
      }
      return true
    }
  }
} as const
```

## Advanced Patterns

### Dependent Fields

```typescript
const orderSchema = {
  status: { 
    type: 'select', 
    options: ['pending', 'shipped', 'delivered'],
    required: true
  },
  shippedAt: { type: 'date' },
  deliveredAt: { type: 'date' }
} as const

// Use hooks to enforce dependencies
const ordersTable = new NotionTable({
  schema: orderSchema,
  hooks: {
    beforeCreate: async (data) => {
      if (data.status === 'shipped' && !data.shippedAt) {
        throw new Error('Shipped date required for shipped orders')
      }
      return data
    }
  }
})
```

### Computed Defaults

```typescript
const documentSchema = {
  title: { type: 'title', required: true },
  slug: { type: 'rich_text' },
  createdAt: { type: 'date' }
} as const

const documentsTable = new NotionTable({
  schema: documentSchema,
  hooks: {
    beforeCreate: async (data) => {
      return {
        ...data,
        // Auto-generate slug from title
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
        // Set creation date
        createdAt: data.createdAt || new Date().toISOString()
      }
    }
  }
})
```

### Nested Data with JSON

```typescript
const configSchema = {
  name: { type: 'title', required: true },
  settings: { 
    type: 'rich_text',
    validate: (value) => {
      try {
        JSON.parse(value)
        return true
      } catch {
        return 'Settings must be valid JSON'
      }
    }
  }
} as const

// Helper functions for JSON fields
const config = await configTable.create({
  name: 'App Config',
  settings: JSON.stringify({
    theme: 'dark',
    features: ['auth', 'analytics']
  })
})

// Parse on retrieval
const parsed = {
  ...config,
  settings: JSON.parse(config.settings)
}
```

## Schema Evolution

### Adding Fields

New optional fields can be added safely:

```typescript
// Version 1
const schemaV1 = {
  title: { type: 'title', required: true }
}

// Version 2 - Safe addition
const schemaV2 = {
  title: { type: 'title', required: true },
  description: { type: 'rich_text' } // Optional field
}
```

### Handling Breaking Changes

```typescript
// Migration strategy for required fields
const migrationSchema = {
  title: { type: 'title', required: true },
  category: { 
    type: 'select',
    options: ['general', 'important'],
    required: true
  }
}

// Add default during migration period
const table = new NotionTable({
  schema: migrationSchema,
  hooks: {
    beforeCreate: async (data) => {
      return {
        ...data,
        category: data.category || 'general'
      }
    }
  }
})
```

## Best Practices

### Use Const Assertions

```typescript
// Good - preserves literal types
const schema = {
  status: { 
    type: 'select', 
    options: ['active', 'inactive'] as const 
  }
} as const

// Avoid - loses type information
const schema = {
  status: { 
    type: 'select', 
    options: ['active', 'inactive']
  }
}
```

### Organize Complex Schemas

```typescript
// Separate concerns
const baseSchema = {
  id: { type: 'title', required: true },
  createdAt: { type: 'date' }
} as const

const userSchema = {
  ...baseSchema,
  email: { type: 'email', required: true },
  role: { type: 'select', options: ['admin', 'user'] }
} as const

const productSchema = {
  ...baseSchema,
  price: { type: 'number', min: 0 },
  stock: { type: 'number', min: 0 }
} as const
```