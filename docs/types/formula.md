# Formula

Computed values from other properties (read-only).

## Schema Definition

```typescript
{
  total: { type: 'formula' },
  fullName: { type: 'formula' }
}
```

## TypeScript Type

```typescript
string | number | boolean | undefined  // Depends on formula result
```

## Writing

Formula fields are computed automatically by Notion and cannot be written directly.

```typescript
// ❌ Cannot set formula values
await table.create({
  total: 100  // This will be ignored
})

// ✅ Set the source fields instead
await table.create({
  price: 50,
  quantity: 2
  // total formula will compute to 100
})
```

## Querying

```typescript
// Query computed values
await table.findMany({
  where: { 
    total: { $gte: 100 }
  }
})

// Available operators depend on formula type
// Number formulas: $eq, $ne, $gt, $gte, $lt, $lte
// String formulas: $contains, $starts_with, $ends_with
// Boolean formulas: true, false
```

## Examples

```typescript
const ordersTable = new NotionTable({
  client,
  tableId: 'orders-db',
  schema: {
    product: { type: 'title' },
    price: { type: 'number' },
    quantity: { type: 'number' },
    total: { type: 'formula' },  // price * quantity
    taxAmount: { type: 'formula' },  // total * 0.1
    grandTotal: { type: 'formula' }  // total + taxAmount
  }
})

// Create order - formulas calculate automatically
const order = await ordersTable.create({
  product: 'Widget',
  price: 29.99,
  quantity: 3
  // total: 89.97 (calculated)
  // taxAmount: 8.997 (calculated)
  // grandTotal: 98.967 (calculated)
})

// Query by formula values
const largeOrders = await ordersTable.findMany({
  where: { 
    grandTotal: { $gte: 1000 }
  }
})

// String formula example
const contactsTable = new NotionTable({
  schema: {
    firstName: { type: 'rich_text' },
    lastName: { type: 'rich_text' },
    fullName: { type: 'formula' }  // Concatenates names
  }
})

// Find by computed full name
const john = await contactsTable.findMany({
  where: { 
    fullName: { $contains: 'John Smith' }
  }
})
```