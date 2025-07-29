# Files

File attachments and media.

## Schema Definition

```typescript
{
  attachments: { type: 'files' },
  images: { type: 'files' }
}
```

## TypeScript Type

```typescript
Array<{
  name: string
  url: string
}> | undefined
```

## Writing

```typescript
await table.create({
  attachments: [
    {
      name: 'document.pdf',
      url: 'https://example.com/files/document.pdf'
    }
  ]
})

await table.update('page-id', {
  images: [
    {
      name: 'screenshot.png',
      url: 'https://example.com/images/screenshot.png'
    }
  ]
})
```

## Querying

```typescript
// Has files
await table.findMany({
  where: { 
    attachments: { $is_not_empty: true }
  }
})

// Available operators
$is_empty     // No files
$is_not_empty // Has files
```

## Examples

```typescript
const documentsTable = new NotionTable({
  client,
  tableId: 'documents-db',
  schema: {
    title: { type: 'title', required: true },
    attachments: { type: 'files' },
    screenshots: { type: 'files' },
    resources: { type: 'files' }
  }
})

// Create document with files
const doc = await documentsTable.create({
  title: 'Project Proposal',
  attachments: [
    {
      name: 'proposal.pdf',
      url: 'https://files.example.com/proposal.pdf'
    },
    {
      name: 'budget.xlsx',
      url: 'https://files.example.com/budget.xlsx'
    }
  ],
  screenshots: [
    {
      name: 'mockup.png',
      url: 'https://images.example.com/mockup.png'
    }
  ]
})

// Find documents with attachments
const withFiles = await documentsTable.findMany({
  where: { 
    attachments: { $is_not_empty: true }
  }
})

// Find documents without screenshots
const noScreenshots = await documentsTable.findMany({
  where: { 
    screenshots: { $is_empty: true }
  }
})
```