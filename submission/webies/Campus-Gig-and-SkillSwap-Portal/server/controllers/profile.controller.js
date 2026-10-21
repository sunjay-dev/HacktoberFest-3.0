import { auth } from '../auth.js'
import { query } from '../db.js'
import { fail } from '../lib/respond.js'

export async function getMe(req, res) {
  if (!auth) return res.json({ auth: false })
  if (!req.sessionUser) return fail(res, 401, 'Not signed in')
  if (!req.domainUserId) return res.json({ user: req.sessionUser, profile: null })
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.domainUserId])
  res.json({ user: req.sessionUser, profile: rows[0] })
}

export async function createProfile(req, res) {
  if (req.domainUserId) {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.domainUserId])
    return res.json(rows[0])
  }
  const { major, semester, bio, skills } = req.body
  const { rows } = await query(
    'INSERT INTO users (name, major, semester, bio, skills, email) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [req.sessionUser.name, major, semester, bio, skills, req.sessionUser.email],
  )
  res.status(201).json(rows[0])
}

export async function updateProfile(req, res) {
  if (!req.domainUserId) return fail(res, 403, 'Create a profile first')
  const { major, semester, bio, skills } = req.body
  const { rows } = await query(
    'UPDATE users SET major = $1, semester = $2, bio = $3, skills = $4 WHERE id = $5 RETURNING *',
    [major, semester, bio, skills, req.domainUserId],
  )
  res.json(rows[0])
}
