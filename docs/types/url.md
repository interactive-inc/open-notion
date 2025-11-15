# URL

Web URLs with validation.

## Schema Definition

```typescript
{
  website: { type: 'url' },
  documentation: { type: 'url' }
}
```

## TypeScript Type

```typescript
string | undefined
// or just string if required
```

## Writing

```typescript
await table.create({
  website: 'https://example.com',
  documentation: 'https://docs.example.com'
})

await table.update('page-id', {
  website: 'https://newsite.com'
})
```

## Querying

```typescript
// Exact match
await table.findMany({
  where: { website: 'https://example.com' }
})

// Domain search
await table.findMany({
  where: { 
    website: { $contains: 'github.com' }
  }
})

// Available operators
$eq           // Equals (default)
$ne           // Not equals
$contains     // Contains substring
$starts_with  // Starts with
$ends_with    // Ends with
$is_empty     // Is empty
$is_not_empty // Is not empty
```

## Examples

```typescript
const projectsTable = new NotionTable({
  client,
  tableId: 'projects-db',
  schema: {
    name: { type: 'title' },
    repository: { type: 'url' },
    homepage: { type: 'url' },
    documentation: { type: 'url' }
  }
})

// Create project
const project = await projectsTable.create({
  name: 'Open Source Project',
  repository: 'https://github.com/company/project',
  homepage: 'https://project.example.com',
  documentation: 'https://docs.project.example.com'
})

// Find GitHub projects
const githubProjects = await projectsTable.findMany({
  where: { 
    repository: { $contains: 'github.com' }
  }
})

// Find projects with documentation
const documented = await projectsTable.findMany({
  where: { 
    documentation: { $is_not_empty: true }
  }
})

// Custom validation
const resourceTable = new NotionTable({
  schema: {
    url: {
      type: 'url',
      
      validate: (value) => {
        if (!value.startsWith('https://')) {
          return 'URL must use HTTPS'
        }
        return true
      }
    }
  }
})
```