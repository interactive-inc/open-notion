import { Client } from "@notionhq/client"
import { NotionTable } from "../lib/table/notion-table"

if (process.env.NOTION_TOKEN === undefined) {
  throw new Error("NOTION_TOKEN is not defined")
}

const client = new Client({ auth: process.env.NOTION_TOKEN })

const table = new NotionTable({
  client: client,
  tableId: "1dd842f961818010a8d8d9eb0ae16444",
  schema: {
    title: { type: "title", required: true },
    number: { type: "number" },
    bool: { type: "checkbox" },
  },
})

{
  await table.upsert({
    where: {
      number: 2,
    },
    update: {
      number: 2,
    },
    insert: {
      title: "default title",
    },
  })

  const records = await table.findMany({
    where: {},
    sorts: [
      {
        field: "number",
        direction: "desc",
      },
    ],
  })

  console.log(records)
}
