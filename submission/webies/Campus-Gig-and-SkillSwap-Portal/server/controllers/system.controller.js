import { dbMode, query } from '../db.js'
import { DERIVED_STATUS } from '../lib/gigs.js'

export async function getHealth(_req, res) {
  const { rows } = await query('SELECT COUNT(*)::int AS users FROM users')
  res.json({ ok: true, db: dbMode, users: rows[0].users })
}

export async function getStats(_req, res) {
  const { rows } = await query(
    `SELECT
       (SELECT COUNT(*)::int FROM gigs g WHERE ${DERIVED_STATUS} = 'Open') AS open_gigs,
       (SELECT COUNT(*)::int FROM users) AS active_students,
       (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews) AS avg_rating,
       (SELECT COUNT(*)::int FROM reviews) AS review_count`,
  )
  res.json(rows[0])
}
