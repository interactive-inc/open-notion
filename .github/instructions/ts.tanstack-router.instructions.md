---
applyTo: "**"
---

# TypeScript + @tanstack/react-router

## Route file

- Do NOT import createFileRoute, this is global variable

```tsx
export const Route = createFileRoute({
  component: Component,
})

function Component() {}
```

## Flat Routes

Flat routing gives you the ability to use `.`s to denote route nesting levels.

for instance:

- `__root.tsx`
- `index.tsx`
- `posts.$post.tsx`
- `users.$user.posts.$post.tsx`
