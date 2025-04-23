import { Client } from "@notionhq/client"
import { defineSchema, defineTable } from "../lib"

if (process.env.NOTION_TOKEN === undefined) {
  throw new Error("NOTION_TOKEN is not defined")
}

const schema = defineSchema({
  title: { type: "title", required: true },
  number: { type: "number" },
  bool: { type: "checkbox" },
})

const client = new Client({ auth: process.env.NOTION_TOKEN })

const table = defineTable({
  notion: client,
  tableId: "1dd842f961818010a8d8d9eb0ae16444",
  schema: schema,
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
