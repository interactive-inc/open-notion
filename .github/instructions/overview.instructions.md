---
applyTo: "**"
description: "copilot-instructions.mdの情報を最新に保ちます。"
---

# copilot-instructions.md

## Purpose and Rationale

### Why This Document Is Needed

To prevent project direction drift during development and maintain system separation. Records only minimal constraints, not detailed specifications.

### Implementation-First Approach

Prioritizes construction and iteration over detailed upfront planning. Keep specifications minimal and evolve through implementation cycles.

### What to Record

- Only content that prevents development direction drift
- Learn requirements through building, not planning
- Prioritize rapid implementation over detailed specifications
- Document architectural boundaries, exclude implementation details

## Operations and User Collaboration

### AI Self-Update Rules

AI automatically appends important constraints and supplementary information discovered during development to `.github/copilot-instructions.md`.

- Important architectural constraints discovered through implementation
- New constraints affecting system separation
- Constraints to prevent development drift

### User Information Collection

#### CRITICAL: Mandatory Project Documentation Check

**ABSOLUTE REQUIREMENT - DO NOT SKIP:**

When user gives ANY implementation request (e.g., "モックのECサイトを作りたい", "〇〇機能を追加して"), AI MUST:

1. **IMMEDIATELY STOP and CHECK** `.github/copilot-instructions.md`
2. **If ANY required section is empty or contains placeholder text ("...", empty, etc.)**:
   - DO NOT start implementation
   - DO NOT make assumptions
   - DO NOT proceed with coding
   - IMMEDIATELY start the interview process

3. **Start with this exact message**:
```
プロジェクトの設定を確認させてください。
.github/copilot-instructions.mdに必要な情報が不足しています。

まず最初の質問です：
[Ask ONE question at a time from the list below]
```

#### Required Interview Questions (Ask ONE at a time)

**IMPORTANT: Ask these questions ONE BY ONE, wait for answer before next question:**

1. **Application Purpose**:
   ```
   このアプリケーションの目的を教えてください：
   - 実際の商品販売用ですか？
   - デモ・プレゼンテーション用ですか？
   - 学習・練習用ですか？
   ```

2. **System Separation**:
   ```
   システムの分離方針を教えてください：
   - フロントエンドのみのモックでよいですか？
   - バックエンドAPIとの連携予定はありますか？
   - データの永続化は必要ですか？
   ```

3. **Core Functionality Placement**:
   ```
   コア機能の配置について教えてください：
   - 現在の構成（src/routesにページ、src/contextsに状態管理）でよいですか？
   - 他に必要な機能や特別な要件はありますか？
   ```

#### Continuous Information Gathering

**During ANY development conversation, if information is unclear:**

1. STOP the current task
2. Ask ONE clarifying question
3. Wait for answer
4. Only then continue

**Trigger conditions for questions:**

- System separation requirements are unclear → ASK before coding
- Core functionality placement is ambiguous → ASK before creating files
- Architectural constraints are missing → ASK before implementing
- Implementation direction could drift → ASK before proceeding

**Question approach:**

- Ask ONE question at a time (NEVER multiple questions)
- Keep questions simple and specific
- Confirm understanding before proceeding

### Update and Operations Rules

- Add constraints only when architectural direction drifts
- Remove specifications that aren't preventing problems
- Focus on maintaining system separation
- Avoid excessive documentation detail

## Templates and Rules

### Required File Template

Fixed structure for `.github/copilot-instructions.md`:

```markdown
# Overview

[Application overview description]

## Directory Structure

[Directory structure]

## Technical Features  

[Technology stack]

## Decoupled Design

[System separation policy]

## Core Location

[Core functionality placement]

## System Independence

[Independence of each system]

## Domain Systems (Optional)

[Domain-specific systems - for special business logic]

## API Design (Optional)

[API design policy - for API-centric projects]

## Data Flow (Optional)

[Data flow - for complex data processing]
```

### Section Name Fixed Rules

**Section names that must never be changed (English fixed):**

- `# Overview`
- `## Directory Structure`  
- `## Technical Features`
- `## Decoupled Design`
- `## Core Location`
- `## System Independence`

**Optional section names that can be added:**

- `## Domain Systems` - For domain-specific systems
- `## API Design` - For API-centric projects
- `## Data Flow` - For complex data processing

### Documentation Guidelines

#### Information to Write

- Stable basic separation policies
- Physical locations of major functionality
- Consistent organization
- Important constraints discovered through implementation

#### Information Not to Write

- Detailed feature specifications (discover through implementation)
- Specific UI designs (iterate through building)
- Complete data models (evolve with requirements)
- Comprehensive API definitions (emerge through use)
