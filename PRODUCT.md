# open-notion 製品仕様書

## 概要

open-notionは、Notion APIとの統合を簡素化するためのTypeScriptライブラリです。NotionブロックとMarkdownの双方向変換、型安全なデータベース操作などの機能を提供します。

## 主要機能

### 1. 型安全なデータベース操作（NotionTable）

Notionデータベースを型安全に操作するためのORMライクなインターフェースを提供します。

#### 基本的な使用方法

```typescript
import { Client } from '@notionhq/client'
import { NotionTable } from '@interactive-inc/notion-client'

const client = new Client({ auth: process.env.NOTION_TOKEN })

const table = new NotionTable({
  client,
  tableId: 'database-id',
  schema: {
    title: { type: 'title', required: true },
    status: { type: 'select', options: ['todo', 'in_progress', 'done'] },
    priority: { type: 'number' }
  } as const
})
```

#### サポートされるプロパティタイプ

- title - タイトル（必須）
- rich_text - リッチテキスト
- number - 数値（min/max検証、各種通貨フォーマット対応）
- select - 単一選択
- multi_select - 複数選択
- status - ステータス
- date - 日付（範囲指定可能）
- people - ユーザー
- files - ファイル
- checkbox - チェックボックス
- url - URL
- email - メールアドレス
- phone_number - 電話番号
- relation - リレーション
- formula - 計算式（読み取り専用）
- rollup - ロールアップ（読み取り専用）
- created_time - 作成日時（自動）
- created_by - 作成者（自動）
- last_edited_time - 最終編集日時（自動）
- last_edited_by - 最終編集者（自動）

#### 主要メソッド

##### 検索・取得
- `findMany(options)` - 複数レコード取得
- `findOne(options)` - 最初の1件を取得
- `findById(id)` - IDで1件取得

##### 作成・更新
- `create(data)` - レコード作成（bodyでMarkdown内容も設定可能）
- `update(id, data)` - レコード更新
- `updateMany(options)` - 条件に一致する複数レコードを更新
- `upsert(options)` - 存在確認後、更新または作成

##### 削除・復元
- `delete(id)` - レコードをアーカイブ
- `deleteMany(where)` - 条件に一致する複数レコードをアーカイブ
- `restore(id)` - アーカイブしたレコードを復元

#### 高度なクエリ機能

##### 演算子
- `$eq` - 等しい（デフォルト）
- `$ne` - 等しくない
- `$gt` - より大きい
- `$gte` - 以上
- `$lt` - より小さい
- `$lte` - 以下
- `$contains` - 含む
- `$or` - OR条件
- `$and` - AND条件
- `$not` - NOT条件

##### 使用例
```typescript
// 複雑なクエリ
const results = await table.findMany({
  where: {
    $or: [
      { status: 'todo' },
      { 
        $and: [
          { priority: { $gte: 5 } },
          { tags: { $contains: 'urgent' } }
        ]
      }
    ]
  },
  sorts: [
    { property: 'priority', direction: 'descending' },
    { property: 'created_time', direction: 'ascending' }
  ],
  limit: 20
})
```

#### バリデーションとフック

```typescript
const table = new NotionTable({
  client,
  tableId: 'database-id',
  schema: {
    email: {
      type: 'email',
      required: true,
      validate: (value) => {
        if (!value.includes('@')) {
          return 'Invalid email format'
        }
        return true
      }
    }
  } as const,
  hooks: {
    beforeCreate: async (data) => data,
    afterCreate: async (record) => record,
    beforeUpdate: async (id, data) => data,
    afterUpdate: async (record) => record,
    beforeFind: async (options) => options,
    afterFind: async (records) => records
  }
})
```

### 2. Markdown統合（NotionMarkdown）

NotionブロックとMarkdownの変換機能を提供します。

#### 基本的な使用方法

```typescript
import { NotionTable, NotionMarkdown } from '@interactive-inc/notion-client'

// 見出しレベルを変換するエンハンサー
const enhancer = new NotionMarkdown({
  heading_1: 'heading_2',  // H1をH2に変換
  heading_2: 'heading_3'   // H2をH3に変換
})

const table = new NotionTable({
  client,
  tableId: 'database-id',
  schema: { title: { type: 'title', required: true } } as const,
  enhancer  // Markdown変換時に適用
})

// Markdownコンテンツを含むレコードを作成
await table.create({
  title: 'ブログ記事',
  body: `# 見出し1
  
これは段落です。**太字**や*斜体*も使えます。

## 見出し2
- リスト項目1
- リスト項目2

\`\`\`javascript
const code = "サンプルコード"
\`\`\`
`
})
```

#### サポートされるブロックタイプ

| Markdown | Notion Block Type | 
|----------|------------------|
| Plain text | `paragraph` |
| `# Heading 1` | `heading_1` |
| `## Heading 2` | `heading_2` |
| `### Heading 3` | `heading_3` |
| `- Item` | `bulleted_list_item` |
| `1. Item` | `numbered_list_item` |
| `` ```code``` `` | `code` |
| `**bold**` | Rich text with bold |
| `*italic*` | Rich text with italic |
| `~~strike~~` | Rich text with strikethrough |
| `` `code` `` | Rich text with code |

## アーキテクチャ

### ディレクトリ構造

```
lib/
├── table/
│   ├── notion-table.ts         # メインのテーブルクラス
│   ├── notion-query-builder.ts # クエリビルダー
│   ├── notion-validator.ts     # バリデーション
│   ├── notion-record-mapper.ts # レコードマッピング
│   └── notion-markdown.ts      # Markdown変換
├── types/
│   ├── schema.ts               # スキーマ定義
│   ├── operators.ts            # クエリ演算子
│   └── block-type.ts           # ブロックタイプ
└── index.ts                    # エクスポート
```

### 主要な型定義

- `Schema` - データベーススキーマ定義
- `SchemaType<T>` - スキーマから推論される型
- `TableRecord<T>` - メタデータ付きレコード型
- `FindOptions` - 検索オプション
- `WhereCondition` - クエリ条件
- `BlockTypeMapping` - ブロックタイプのマッピング

## 今後の課題と未対応機能

### ブロックタイプの拡張

#### 基本ブロック
- [ ] 引用ブロック（quote）
- [ ] 区切り線（divider）
- [ ] ToDoリスト（to_do）
- [ ] トグルリスト（toggle）
- [ ] コールアウト（callout）

#### メディア系
- [ ] 画像（image）
- [ ] 動画（video）
- [ ] 音声（audio）
- [ ] ファイル（file）
- [ ] PDF（pdf）

#### 高度なブロック
- [ ] テーブル（table/table_row）
- [ ] 数式（equation）- LaTeX形式
- [ ] 埋め込み（embed）
- [ ] ブックマーク（bookmark）
- [ ] リンクプレビュー（link_preview）

#### レイアウト系
- [ ] カラムレイアウト（column_list/column）
- [ ] 同期ブロック（synced_block）

### データベース機能の拡張

#### クエリ機能
- [ ] `$in` 演算子 - 複数値のいずれかに一致
- [ ] `$nin` 演算子 - 複数値のいずれにも一致しない
- [ ] 集計関数（COUNT、SUM、AVG、MIN、MAX）
- [ ] GROUP BY相当の機能

#### プロパティタイプ
- [ ] プロパティタイプごとの詳細な検証
- [ ] カスタムプロパティタイプのサポート

### リッチテキストの拡張
- [ ] テキスト色・背景色のサポート
- [ ] リンクの完全なサポート
- [ ] メンション（ユーザー、ページ、日付）

### その他の機能
- [ ] インラインデータベース
- [ ] ページテンプレート
- [ ] 権限管理
- [ ] リアルタイム同期
- [ ] バッチ操作の最適化
- [ ] エラーハンドリングの改善
- [ ] ロギングとデバッグ機能

## 制限事項

- コードブロックの言語指定は現在"plain text"固定
- 一度に取得できるレコード数はNotion APIの制限により最大100件
- ページネーションを使用しても最大取得件数に制限あり
- 一部の高度なブロックタイプは未対応
- リッチテキストの一部の装飾は未対応