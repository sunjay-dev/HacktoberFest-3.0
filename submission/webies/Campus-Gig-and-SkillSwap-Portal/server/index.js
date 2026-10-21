import app from './app.js'
import { SCHEMA, dbMode, exec, initDb } from './db.js'
import { seedIfEmpty } from './seed.js'
import { seedAuthAccounts } from './seed-auth.js'

const PORT = process.env.API_PORT || 4000

await initDb()
await exec(SCHEMA)
const seeded = await seedIfEmpty()
await seedAuthAccounts()

console.log(`Campus Gig API on http://localhost:${PORT} — db: ${dbMode}${seeded ? ' (seeded: 12 users, 25 gigs, 20 applications, 8 reviews)' : ''}`)
app.listen(PORT)
