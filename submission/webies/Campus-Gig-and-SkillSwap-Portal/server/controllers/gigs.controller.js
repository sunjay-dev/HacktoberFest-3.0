import { query } from '../db.js'
import { DERIVED_STATUS, getGig } from '../lib/gigs.js'
import { fail } from '../lib/respond.js'

export async function listGigs(req, res) {
  const { q, category, type, payment_type, min_budget, max_budget, status } = req.query
  const where = []
  const params = []
  const add = (build) => { where.push(build(params)) }

  if (q) add((p) => { p.push(`%${q}%`, `%${q}%`); return `(g.title ILIKE $${p.length - 1} OR g.description ILIKE $${p.length})` })
  if (category) add((p) => { p.push(category); return `g.category = $${p.length}` })
  if (type) add((p) => { p.push(type); return `g.type = $${p.length}` })
  if (payment_type) add((p) => { p.push(payment_type); return `g.payment_type = $${p.length}` })
  if (min_budget) add((p) => { p.push(Number(min_budget)); return `g.budget >= $${p.length}` })
  if (max_budget) add((p) => { p.push(Number(max_budget)); return `g.budget <= $${p.length}` })
  if (status) add((p) => { p.push(status); return `${DERIVED_STATUS} = $${p.length}` })

  let sql = `SELECT g.*, ${DERIVED_STATUS} AS display_status,
                    u.name AS owner_name, u.major AS owner_major,
                    (SELECT COUNT(*)::int FROM applications a WHERE a.gig_id = g.id) AS applications_count
               FROM gigs g JOIN users u ON u.id = g.user_id`
  if (where.length) sql += ` WHERE ${where.join(' AND ')}`
  sql += ` ORDER BY CASE ${DERIVED_STATUS} WHEN 'Open' THEN 0 WHEN 'In Progress' THEN 1 WHEN 'Completed' THEN 2 WHEN 'Expired' THEN 3 ELSE 4 END, g.id DESC`
  const { rows } = await query(sql, params)
  res.json(rows)
}

export async function getGigById(req, res) {
  const gig = await getGig(req.params.id)
  if (!gig) return fail(res, 404, 'Gig not found')
  res.json(gig)
}

export async function createGig(req, res) {
  const { title, description, type, category, payment_type, budget, deadline } = req.body

  const { rows: owner } = await query('SELECT id FROM users WHERE id = $1', [req.actorId])
  if (!owner[0]) return fail(res, 404, 'User not found')

  const { rows } = await query(
    `INSERT INTO gigs (user_id, title, description, type, category, payment_type, budget, deadline)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.actorId, title, description, type, category, payment_type, payment_type === 'Paid' ? Number(budget) : null, deadline],
  )
  res.status(201).json(await getGig(rows[0].id))
}

export async function updateGigStatus(req, res) {
  const { status } = req.body

  const gig = await getGig(req.params.id)
  if (!gig) return fail(res, 404, 'Gig not found')
  if (Number(req.actorId) !== gig.user_id) return fail(res, 403, 'Only the gig owner may change gig status')

  const allowed = { 'In Progress': ['Completed'], Open: ['Cancelled'] }
  if (!(allowed[gig.status] || []).includes(status)) {
    return fail(res, 422, `Cannot change a ${gig.display_status} gig to ${status}`)
  }
  await query('UPDATE gigs SET status = $1 WHERE id = $2', [status, gig.id])
  res.json(await getGig(gig.id))
}
