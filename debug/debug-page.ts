import { Client } from "@notionhq/client"
import { PageReference } from "@/modules/page-reference"
import { toNotionBlocks } from "@/to-notion-block/to-notion-blocks"

// NotionクライアントをIBearTokenで初期化
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const pageId = "1dd842f961818176b2a4ce69051b69f0"

try {
  // ページを取得
  const page = await notion.pages.retrieve({ page_id: pageId })

  if (!("properties" in page)) {
    throw new Error("Page not found or not accessible")
  }

  // PageReferenceインスタンスを作成
  const pageRef = new PageReference({
    notion,
    pageId,
    properties: page.properties,
    rawData: page,
  })

  console.log("ページプロパティ:", pageRef.properties())

  // 本文をマークダウン形式で取得
  console.log("マークダウンを読み込み中...")
  const markdown = await pageRef.body()
  console.log("取得したマークダウン:")
  console.log(markdown)
  console.log("---")

  // マークダウンをNotionブロックに変換
  console.log("マークダウンをNotionブロックに変換中...")
  const blocks = toNotionBlocks(markdown)
  console.log("変換されたブロック数:", blocks.length)
  console.log("最初のブロック:", JSON.stringify(blocks[0], null, 2))

  // 既存の子ブロックを削除
  console.log("既存のブロックを削除中...")
  const existingBlocks = await notion.blocks.children.list({
    block_id: pageId,
  })

  for (const block of existingBlocks.results) {
    if ("id" in block) {
      await notion.blocks.delete({ block_id: block.id })
    }
  }

  // 新しいブロックを追加
  console.log("新しいブロックを追加中...")
  if (blocks.length > 0) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: blocks,
    })
  }

  console.log("ページの更新が完了しました")
} catch (error) {
  console.error("エラーが発生しました:", error)
}
