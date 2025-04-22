import { createClient, defineSchema } from "../lib/database/database"

if (process.env.NOTION_TOKEN === undefined) {
  throw new Error("NOTION_TOKEN is not defined")
}

const schema = defineSchema({
  title: { type: "title", required: true },
  number: { type: "number" },
})

const table = createClient(
  process.env.NOTION_TOKEN,
  "1dd842f961818010a8d8d9eb0ae16444",
  schema,
)

const records = await table.findAll()

console.log(records)
