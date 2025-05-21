import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "./schema"

export const client = new Client({
    connectionString: process.env.Database_URL as string
})

const main = async () => {
    await client.connect();
}

main()

const db = drizzle(client, { schema, logger: false }) //create a drizzle instance

export default db;
