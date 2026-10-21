import { query, withTransaction } from '../db.js'
import { DERIVED_STATUS, getGig } from '../lib/gigs.js'
import { fail } from '../lib/respond.js'

export async function listApplications(req, res) {
  const { applicant_id, gig_id } = req.query
  const where = []
  const params = []
  if (applicant_id) { params.push(applicant_id); where.push(`a.applicant_id = $${params.length}`) }
  if (gig_id) { params.push(gig_id); where.push(`a.gig_id = $${params.length}`) }

  const { rows } = await query(
    `SELECT a.*, g.title AS gig_title, ${DERIVED_STATUS} AS gig_status, g.user_id AS gig_owner_id,
            u.name AS applicant_name, u.major AS applicant_major
       FROM applications a
       JOIN gigs g ON g.id = a.gig_id
       JOIN users u ON u.id = a.applicant_id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY a.created_at DESC`,
    params,
  )
  res.json(rows)
}

export async function createApplication(req, res) {
  const { gig_id, message } = req.body

  const gig = await getGig(gig_id)
  if (!gig) return fail(res, 404, 'Gig not found')
  if (Number(req.actorId) === gig.user_id) return fail(res, 422, 'You cannot apply to your own gig')
  if (gig.display_status !== 'Open') return fail(res, 422, `This gig is ${gig.display_status} and is not accepting applications`)

  const { rows: existing } = await query('SELECT id FROM applications WHERE gig_id = $1 AND applicant_id = $2', [gig_id, req.actorId])
  if (existing[0]) return fail(res, 422, 'You have already applied to this gig')

  try {
    const { rows } = await query(
      'INSERT INTO applications (gig_id, applicant_id, message) VALUES ($1,$2,$3) RETURNING *',
      [gig_id, req.actorId, message],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505') return fail(res, 422, 'You have already applied to this gig')
    throw err
  }
}

export async function updateApplication(req, res) {
  const { status } = req.body

  const { rows } = await query('SELECT * FROM applications WHERE id = $1', [req.params.id])
  const application = rows[0]
  if (!application) return fail(res, 404, 'Application not found')
  const gig = await getGig(application.gig_id)
  if (Number(req.actorId) !== gig.user_id) return fail(res, 403, 'Only the gig owner may review applications')
  if (application.status !== 'Pending') return fail(res, 422, `Application is already ${application.status}`)

  if (status === 'Rejected') {
    await query('UPDATE applications SET status = $1 WHERE id = $2', ['Rejected', application.id])
  } else {
    if (gig.display_status !== 'Open') return fail(res, 422, `Cannot accept an applicant for a ${gig.display_status} gig`)
    await withTransaction(async (q) => {
      await q('UPDATE applications SET status = $1 WHERE id = $2', ['Accepted', application.id])
      await q('UPDATE applications SET status = $1 WHERE gig_id = $2 AND status = $3 AND id <> $4', ['Rejected', gig.id, 'Pending', application.id])
      await q('UPDATE gigs SET status = $1, accepted_applicant_id = $2 WHERE id = $3', ['In Progress', application.applicant_id, gig.id])
    })
  }
  const { rows: updated } = await query('SELECT * FROM applications WHERE id = $1', [application.id])
  res.json(updated[0])
}
