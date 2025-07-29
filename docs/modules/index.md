# API

Core modules that power notion-client's functionality.

## Overview

notion-client consists of several modules that work together to provide a seamless experience:

```
NotionTable (Main Interface)
    ├── Schema validation & Type inference
    ├── Property conversion (Notion ↔ Simple values)
    └── Query building (MongoDB-style → Notion filters)

Markdown Processing
    ├── toNotionBlocks (Markdown → Notion blocks)
    ├── fromNotionBlocks (Notion blocks → Markdown)
    └── NotionMarkdown (Heading level enhancement)

Block Enhancement
    └── enhance (Recursive child block fetching)
```

## Module Relationships

### Database Operations Flow

```typescript
// 1. Define schema → NotionTable validates and infers types
const table = new NotionTable({ schema })

// 2. Create with markdown → toNotionBlocks converts content
await table.create({ 
  title: 'Page',
  body: '# Markdown content' 
})

// 3. Query with filters → Query builder translates syntax
await table.findMany({ 
  where: { status: 'active' } 
})

// 4. Read with blocks → fromNotionBlocks converts to markdown
const content = fromNotionBlocks(blocks)
```

### Content Processing Pipeline

```typescript
// Input: Markdown text
const markdown = '# Title\n**Bold** text'

// Process: Convert to Notion blocks with enhancement
const enhancer = new NotionMarkdown({ heading_1: 'heading_2' })
const blocks = await toNotionBlocks(markdown, enhancer)

// Store: Save to Notion database
await table.create({ title: 'Doc', body: markdown })

// Retrieve: Fetch with nested blocks
const fetchBlocks = enhance(client)
const allBlocks = await fetchBlocks({ block_id: 'page-id' })

// Output: Convert back to markdown
const result = fromNotionBlocks(allBlocks)
```

## Core Modules

### NotionTable

The main entry point for database operations:
- Schema validation
- Type-safe CRUD operations
- Query building
- Property conversion
- Lifecycle hooks

### NotionMarkdown

Transforms heading levels during markdown conversion:
- Adjust heading hierarchy
- Maintain document structure
- Integrate with content pipeline

### Conversion Functions

**toNotionBlocks** - Markdown → Notion
- Parse markdown syntax
- Create block objects
- Apply text annotations
- Support code blocks and lists

**fromNotionBlocks** - Notion → Markdown
- Extract text content
- Preserve formatting
- Handle nested structures
- Generate clean markdown

### enhance Function

Recursively fetches all child blocks:
- Overcome API limitations
- Fetch complete page content
- Maintain block relationships

## Usage Patterns

### Complete Setup

```typescript
import { 
  NotionTable, 
  NotionMarkdown,
  toNotionBlocks,
  fromNotionBlocks,
  enhance
} from '@interactive-inc/notion-client'

// Database operations
const table = new NotionTable({ ...config })

// Content transformation
const enhancer = new NotionMarkdown({ ...options })

// Block processing
const fetchAllBlocks = enhance(notionClient)
```

### Common Workflows

1. **Database with Markdown**
   ```typescript
   NotionTable + toNotionBlocks + NotionMarkdown
   ```

2. **Page Export**
   ```typescript
   enhance + fromNotionBlocks
   ```

3. **Content Migration**
   ```typescript
   toNotionBlocks + NotionTable + fromNotionBlocks
   ```

Each module is designed to work independently or together, providing flexibility for different use cases.