---
applyTo: "**"
---

# TypeScript + @tanstack/react-query

## Data Fetching

Use `useSuspenseQuery` for fetching data

```tsx
import { useSuspenseQuery } from 'react-query'

const query = useSuspenseQuery(AdminViewingBannerQuery, {
  variables: { id: props.organizationId },
})
```

## Error handling

```ts
import { useMutation } from "@tanstack/react-query"

const mutation = useMutation({
  mutationFn(data) {
    // Your mutation logic here
  },
  onError(error) {
    // Handle error, e.g., show a toast notification
  },
})
```
