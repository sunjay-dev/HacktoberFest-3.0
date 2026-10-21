import { query } from '../db.js'
import { getGig } from '../lib/gigs.js'
import { fail } from '../lib/respond.js'

export async function listReviews(req, res) {
  const { gig_id, reviewee_id, reviewer_id } = req.query
  const where = []
  const params = []
  if (gig_id) { params.push(gig_id); where.push(`r.gig_id = $${params.length}`) }
  if (reviewee_id) { params.push(reviewee_id); where.push(`r.reviewee_id = $${params.length}`) }
  if (reviewer_id) { params.push(reviewer_id); where.push(`r.reviewer_id = $${params.length}`) }

  const { rows } = await query(
    `SELECT r.*, ru.name AS reviewer_name, g.title AS gig_title
       FROM reviews r JOIN users ru ON ru.id = r.reviewer_id JOIN gigs g ON g.id = r.gig_id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY r.created_at DESC`,
    params,
  )
  res.json(rows)
}

export async function createReview(req, res) {
  const { gig_id, rating, comment } = req.body

  const gig = await getGig(gig_id)
  if (!gig) return fail(res, 404, 'Gig not found')
  if (gig.status !== 'Completed') return fail(res, 422, 'Reviews are only allowed after a gig is completed')

  const reviewer = Number(req.actorId)
  const isOwner = reviewer === gig.user_id
  const isAccepted = reviewer === gig.accepted_applicant_id
  if (!isOwner && !isAccepted) return fail(res, 403, 'Only the gig owner and the accepted applicant may review this gig')
  const reviewee_id = isOwner ? gig.accepted_applicant_id : gig.user_id
  if (!reviewee_id) return fail(res, 422, 'This gig has no accepted applicant to review')

  const { rows: existing } = await query('SELECT id FROM reviews WHERE gig_id = $1 AND reviewer_id = $2', [gig_id, reviewer])
  if (existing[0]) return fail(res, 422, 'You have already reviewed this gig')

  try {
    const { rows } = await query(
      'INSERT INTO reviews (gig_id, reviewer_id, reviewee_id, rating, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [gig_id, reviewer, reviewee_id, rating, comment],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505') return fail(res, 422, 'You have already reviewed this gig')
    throw err
  }
}
