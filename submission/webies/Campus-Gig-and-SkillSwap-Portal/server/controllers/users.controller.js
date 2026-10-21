import { query } from '../db.js'
import { fail } from '../lib/respond.js'

const USER_SELECT = `SELECT u.*,
            (SELECT COUNT(*)::int FROM gigs g WHERE g.user_id = u.id) AS gigs_posted,
            (SELECT COUNT(*)::int FROM gigs g WHERE g.status = 'Completed' AND (g.user_id = u.id OR g.accepted_applicant_id = u.id)) AS gigs_completed,
            (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM reviews r WHERE r.reviewee_id = u.id) AS average_rating,
            (SELECT COUNT(*)::int FROM reviews r WHERE r.reviewee_id = u.id) AS review_count
       FROM users u`

const withRatingNumber = (u) => ({ ...u, average_rating: u.average_rating ? Number(u.average_rating) : null })

export async function listUsers(_req, res) {
  const { rows } = await query(`${USER_SELECT} ORDER BY u.id`)
  res.json(rows.map(withRatingNumber))
}

export async function getUser(req, res) {
  const { rows } = await query(`${USER_SELECT} WHERE u.id = $1`, [req.params.id])
  if (!rows[0]) return fail(res, 404, 'User not found')

  const { rows: reviews } = await query(
    `SELECT r.*, ru.name AS reviewer_name, g.title AS gig_title
       FROM reviews r JOIN users ru ON ru.id = r.reviewer_id JOIN gigs g ON g.id = r.gig_id
      WHERE r.reviewee_id = $1 ORDER BY r.created_at DESC`,
    [req.params.id],
  )
  res.json({ ...withRatingNumber(rows[0]), reviews_received: reviews })
}
