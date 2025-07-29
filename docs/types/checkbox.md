# Checkbox

Boolean true/false values.

## Schema Definition

```typescript
{
  isActive: { type: 'checkbox' },
  isPublished: { type: 'checkbox', required: true }
}
```

## TypeScript Type

```typescript
boolean | undefined
// or just boolean if required
```

## Writing

```typescript
await table.create({
  isActive: true,
  isPublished: false
})

await table.update('page-id', {
  isPublished: true
})
```

## Querying

```typescript
// Exact match
await table.findMany({
  where: { isActive: true }
})

// Find unchecked
await table.findMany({
  where: { isPublished: false }
})

// Available operators
true   // Checked
false  // Unchecked
```

## Examples

```typescript
const articlesTable = new NotionTable({
  client,
  tableId: 'articles-db',
  schema: {
    title: { type: 'title', required: true },
    published: { type: 'checkbox' },
    featured: { type: 'checkbox' },
    allowComments: { type: 'checkbox' }
  }
})

// Create draft article
const article = await articlesTable.create({
  title: 'Getting Started with TypeScript',
  published: false,
  featured: false,
  allowComments: true
})

// Publish article
await articlesTable.update(article.id, {
  published: true
})

// Find all published articles
const publishedArticles = await articlesTable.findMany({
  where: { published: true }
})

// Find featured articles
const featured = await articlesTable.findMany({
  where: { 
    published: true,
    featured: true
  }
})
```