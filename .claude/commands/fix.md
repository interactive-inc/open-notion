---
description: Fix bugs in the codebase
---

# Fix bugs

Fix all errors by calling appropriate Subagents to modify files. Repeat command execution until all problems are resolved.

## Context

- TypeScript Errors: !`bun tsgo --noEmit`
- Biome Errors: !`bun biome check . --fix --unsafe`
- Bun Test Errors: !`bun test`
