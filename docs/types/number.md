# Number

Numeric values with optional validation.

## Schema Definition

```typescript
{
  price: { type: 'number' },
  quantity: { 
    type: 'number', 
    required: true,
    min: 0,
    max: 1000
  }
}
```

## TypeScript Type

```typescript
number | undefined
// or just number if required
```

## Writing

```typescript
await table.create({
  price: 29.99,
  quantity: 100
})

await table.update('page-id', {
  price: 34.99
})
```

## Querying

```typescript
// Exact match
await table.findMany({
  where: { price: 29.99 }
})

// Comparison operators
await table.findMany({
  where: { 
    price: { $gte: 20, $lte: 50 }
  }
})

// Available operators
$eq           // Equals (default)
$ne           // Not equals
$gt           // Greater than
$gte          // Greater than or equal
$lt           // Less than
$lte          // Less than or equal
$is_empty     // Is empty
$is_not_empty // Is not empty
```

## Examples

```typescript
const productsTable = new NotionTable({
  client,
  tableId: 'products-db',
  schema: {
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
    },
    rating: {
      type: 'number',
      min: 1,
      max: 5
    }
  }
})

// Create product
const product = await productsTable.create({
  name: 'Premium Widget',
  price: 49.99,
  stock: 500,
  rating: 4.5
})

// Find products in price range
const affordable = await productsTable.findMany({
  where: { 
    price: { $gte: 10, $lte: 100 },
    stock: { $gt: 0 }
  },
  sorts: [{ property: 'price', direction: 'ascending' }]
})

// Find highly rated products
const topRated = await productsTable.findMany({
  where: { rating: { $gte: 4 } }
})
```