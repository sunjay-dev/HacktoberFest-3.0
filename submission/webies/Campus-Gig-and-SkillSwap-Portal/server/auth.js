import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

export const DEMO_PASSWORD = 'campus1234'

export const auth = process.env.DATABASE_URL
  ? betterAuth({
      database: new Pool({ connectionString: process.env.DATABASE_URL }),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      trustedOrigins: [
        'http://localhost:3000',
        ...(process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean) : []),
      ],
      emailAndPassword: { enabled: true },
    })
  : null
