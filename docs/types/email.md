# Email

Email address with built-in validation.

## Schema Definition

```typescript
{
  email: { type: 'email' },
  workEmail: { type: 'email', required: true }
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
  email: 'user@example.com',
  workEmail: 'john@company.com'
})

await table.update('page-id', {
  email: 'newemail@example.com'
})
```

## Querying

```typescript
// Exact match
await table.findMany({
  where: { email: 'user@example.com' }
})

// Domain search
await table.findMany({
  where: { 
    email: { $ends_with: '@company.com' }
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
const contactsTable = new NotionTable({
  client,
  tableId: 'contacts-db',
  schema: {
    name: { type: 'title', required: true },
    email: { type: 'email', required: true },
    alternateEmail: { type: 'email' }
  }
})

// Create contact
const contact = await contactsTable.create({
  name: 'John Doe',
  email: 'john.doe@example.com',
  alternateEmail: 'johndoe@personal.com'
})

// Find by exact email
const found = await contactsTable.findOne({
  where: { email: 'john.doe@example.com' }
})

// Find all company emails
const companyContacts = await contactsTable.findMany({
  where: { 
    email: { $ends_with: '@company.com' }
  }
})

// Custom validation
const userTable = new NotionTable({
  schema: {
    email: {
      type: 'email',
      required: true,
      validate: (value) => {
        if (!value.includes('@company.com')) {
          return 'Must use company email'
        }
        return true
      }
    }
  }
})
```