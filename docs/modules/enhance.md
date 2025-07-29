# NotionMarkdown

Transform markdown heading levels when converting to Notion blocks.

## Import

```typescript
import { NotionMarkdown } from '@interactive-inc/notion-client'
```

## Constructor

```typescript
new NotionMarkdown({
  heading_1?: 'heading_1' | 'heading_2' | 'heading_3',
  heading_2?: 'heading_1' | 'heading_2' | 'heading_3',
  heading_3?: 'heading_1' | 'heading_2' | 'heading_3'
})
```

## Purpose

Notion has limited heading levels (H1, H2, H3). The NotionMarkdown enhancer allows you to shift heading levels to maintain hierarchy when importing markdown content.

## Basic Usage

```typescript
// Shift all headings down one level
const enhancer = new NotionMarkdown({
  heading_1: 'heading_2',  // # → ##
  heading_2: 'heading_3'   // ## → ###
})

// Use with NotionTable
const docsTable = new NotionTable({
  client,
  tableId: 'docs-db',
  schema: { title: { type: 'title', required: true } },
  enhancer
})
```

## Examples

### Standard Shift Pattern

```typescript
// Most common: shift everything down
const standardEnhancer = new NotionMarkdown({
  heading_1: 'heading_2',
  heading_2: 'heading_3',
  heading_3: 'heading_3'  // H3 stays H3 (can't go lower)
})

// Markdown input
const markdown = `# Main Title
## Section
### Subsection`

// After enhancement in Notion:
// ## Main Title (was H1)
// ### Section (was H2)
// ### Subsection (stays H3)
```

### Flatten to Single Level

```typescript
// Make all headings the same level
const flatEnhancer = new NotionMarkdown({
  heading_1: 'heading_2',
  heading_2: 'heading_2',
  heading_3: 'heading_2'
})

// All headings become H2 in Notion
```

### Selective Enhancement

```typescript
// Only transform H1, leave others unchanged
const selectiveEnhancer = new NotionMarkdown({
  heading_1: 'heading_3'  // Only H1 → H3
  // H2 and H3 remain unchanged
})
```

## Use Cases

### Documentation Import

```typescript
// Documentation often starts with H1
const docsEnhancer = new NotionMarkdown({
  heading_1: 'heading_2',  // Page title is H1, content starts at H2
  heading_2: 'heading_3',
  heading_3: 'heading_3'
})

await docsTable.create({
  title: 'API Documentation',  // This is the "H1"
  body: `# Overview           // Becomes H2
  
## Authentication             // Becomes H3
### API Keys                  // Stays H3
### OAuth Flow                // Stays H3

## Endpoints                  // Becomes H3
### GET /users                // Stays H3`
})
```

### Blog Posts

```typescript
// Blog posts with deep nesting
const blogEnhancer = new NotionMarkdown({
  heading_1: 'heading_1',  // Keep main sections as H1
  heading_2: 'heading_2',  // Keep subsections as H2
  heading_3: 'heading_3'   // Keep sub-subsections as H3
})
```

### Meeting Notes

```typescript
// Flatten structure for simple notes
const notesEnhancer = new NotionMarkdown({
  heading_1: 'heading_2',
  heading_2: 'heading_2',
  heading_3: 'heading_2'
})

await notesTable.create({
  title: 'Team Meeting - Jan 15',
  body: `# Agenda              // All become H2
## Project Updates           // for consistent
### Website Launch          // visual hierarchy`
})
```

## Integration with toNotionBlocks

```typescript
import { toNotionBlocks, NotionMarkdown } from '@interactive-inc/notion-client'

const enhancer = new NotionMarkdown({
  heading_1: 'heading_2',
  heading_2: 'heading_3'
})

const markdown = `# Title
## Subtitle
Content here`

// Convert with enhancement
const blocks = await toNotionBlocks(markdown, enhancer)

// Results in Notion blocks with shifted heading levels
```

## Best Practices

### Consistent Hierarchy

```typescript
// Good: Maintain relative hierarchy
new NotionMarkdown({
  heading_1: 'heading_2',
  heading_2: 'heading_3',
  heading_3: 'heading_3'
})

// Avoid: Inverted hierarchy
new NotionMarkdown({
  heading_1: 'heading_3',
  heading_2: 'heading_1'  // Confusing!
})
```

### Document Structure

```typescript
// For documents with title in Notion page
const docEnhancer = new NotionMarkdown({
  heading_1: 'heading_2'  // Shift down since page has title
})

// For standalone content
const contentEnhancer = new NotionMarkdown({
  // No transformation - preserve original levels
})
```