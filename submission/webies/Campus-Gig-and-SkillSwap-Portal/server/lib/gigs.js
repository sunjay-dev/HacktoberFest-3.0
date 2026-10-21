import { query } from '../db.js'

export const DERIVED_STATUS = `CASE WHEN g.status = 'Open' AND g.deadline < CURRENT_DATE THEN 'Expired' ELSE g.status END`

export async function getGig(id) {
  const { rows } = await query(
    `SELECT g.*, ${DERIVED_STATUS} AS display_status,
            u.name AS owner_name, u.major AS owner_major
       FROM gigs g JOIN users u ON u.id = g.user_id WHERE g.id = $1`,
    [id],
  )
  return rows[0] || null
}
