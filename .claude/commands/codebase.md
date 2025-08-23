---
description: 'Update the codebase information file.'
---

# Codebase

Update the codebase information file that manages minimum information for AI to understand the codebase. This file will not be read by humans.

Target file: @.github/instructions/~.instructions.md

## Rules

- Write in English
- Keep content concise and minimal
- Ensure information is up-to-date
- Do NOT change section titles in the format
- Only include important directories
- Explore subdirectories as well
- Ignore: directories starting with dots, configuration files, "docs" directory, items with obvious purposes

## File Format

```
# Overview

[Product overview]

## Directory Structure

- `lib/api` - API
- `lib/api/routes` - API routing

## Technical Features

- Remix
- Shopify Hydrogen framework

## Appendix A (Optional)

[Additional information if needed]

## Appendix B (Optional)

[Additional information if needed]
```

For monorepo, use the following format:

```
# Overview

[Product overview]

### Directory Structure

[Overview]

- `packages/product-a` - Product A
- `packages/product-b` - Product B

### Technical Features

[Overview]

- Remix
- Shopify Hydrogen framework

## Product A

[Product overview]

### Directory Structure

[Overview]

- `lib/api` - API
- `lib/api/routes` - API routing

### Technical Features

[Overview]

- Remix
- Shopify Hydrogen framework

## Product B

[Product overview]

### Directory Structure

[Overview]

- `lib/api` - API
- `lib/api/routes` - API routing

### Technical Features

[Overview]

- Remix
- Shopify Hydrogen framework

## Appendix A (Optional)

[Additional information if needed]

## Appendix B (Optional)

[Additional information if needed]
```
