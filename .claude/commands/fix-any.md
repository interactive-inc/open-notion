---
description: 'Fix Any types in TypeScript code'
---

# Fix Any Types

Find and replace `as any` type assertions with proper TypeScript types.

## Context

- TypeScript Errors: !`bun tsgo --noEmit`

## Steps

1. Search codebase for `as any` usage
2. Analyze context and determine correct type
3. Replace with specific type annotations
4. Verify with `bun tsgo --noEmit`

## Common Patterns

- Event handlers: `as React.MouseEvent<HTMLButtonElement>`
- API responses: Define interface or use existing types
- Third-party libraries: Import proper types or create type declarations
- DOM elements: Use specific HTMLElement types

## Validation

Run TypeScript check after changes:
```bash
bun tsgo --noEmit
```
