---
description: 'Update the repository-wide codebase information file (copilot-instructions).'
---

# Codebase Overview

Generate or update the repository-wide codebase information file that provides minimum information for AI to understand the entire project structure. This file will not be read by humans.

Target file: @.github/copilot-instructions.md

## Rules

- Write in English
- Keep content concise and minimal
- Ensure information is up-to-date
- Do NOT change section titles in the format
- Only include important directories
- Explore subdirectories as well
- Ignore: directories starting with dots, configuration files, "docs" directory, items with obvious purposes

## Standard Repository Format

```
# Overview

[What this repository does - one paragraph describing the main purpose]

## Architecture Pattern

[High-level architecture description - monolith/microservices/monorepo/etc.]

## Directory Structure

- `lib/api` - API layer
- `lib/api/routes` - API routing
- `components/` - Shared UI components

## Technical Features

- **Framework**: [Main framework and why]
- **Database**: [Database technology and purpose]
- **Authentication**: [Auth approach]
- **Deployment**: [Deployment strategy]

## Extension Points

- **New API Routes**: Add to `lib/api/routes/`
- **New Components**: Add to `components/` following existing patterns
- **New Features**: [Where and how to add new functionality]
```

## Monorepo Format

For monorepos with multiple products:

```
# Overview

[Repository overview - what this monorepo contains]

## Architecture Pattern

[Monorepo structure and inter-package relationships]

### Directory Structure

- `packages/product-a` - Product A description
- `packages/product-b` - Product B description
- `shared/` - Shared utilities

### Technical Features

- **Monorepo Tool**: [Lerna/Rush/Nx and why]
- **Shared Tech Stack**: [Common technologies across packages]

## Product A

[What Product A does]

### Directory Structure

- `lib/api` - API layer
- `lib/api/routes` - API routing

### Technical Features

- **Framework**: [Specific to this product]
- **Database**: [If different from main]

### Extension Points

- **New Features**: [How to extend Product A]

## Product B

[What Product B does]

### Directory Structure

- `lib/core` - Core business logic
- `lib/ui` - UI components

### Technical Features

- **Framework**: [Specific to this product]

### Extension Points

- **New Features**: [How to extend Product B]

## Cross-Package Extension Points

- **New Package**: [How to add new packages to monorepo]
- **Shared Utilities**: [How to add to shared/]
```
