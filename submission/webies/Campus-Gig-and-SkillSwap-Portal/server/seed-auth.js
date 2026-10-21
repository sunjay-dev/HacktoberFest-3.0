import { auth, DEMO_PASSWORD } from './auth.js'
import { query } from './db.js'

export async function seedAuthAccounts() {
  if (!auth) return
  try {
    const { rows: tables } = await query(`SELECT to_regclass('public."user"') AS t`)
    if (!tables[0].t) { console.log('Better Auth tables not found — run the Better Auth migration first'); return }
    const { rows: us } = await query('SELECT name, email FROM users WHERE email IS NOT NULL ORDER BY id')
    let created = 0
    for (const u of us) {
      const { rows: existing } = await query('SELECT id FROM "user" WHERE email = $1', [u.email])
      if (!existing[0]) {
        await auth.api.signUpEmail({ body: { name: u.name, email: u.email, password: DEMO_PASSWORD } })
        created++
      }
    }
    if (created) console.log(`Better Auth: created ${created} demo accounts (password: ${DEMO_PASSWORD})`)
  } catch (err) {
    console.log('Better Auth account seeding skipped:', err.message)
  }
}
