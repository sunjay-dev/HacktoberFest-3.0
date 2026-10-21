import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth.js'
import { query } from '../db.js'
import { fail } from '../lib/respond.js'

export async function resolveSession(req, _res, next) {
  req.domainUserId = null
  req.sessionUser = null
  if (auth) {
    try {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
      if (session?.user?.email) {
        req.sessionUser = session.user
        const { rows } = await query('SELECT id FROM users WHERE email = $1', [session.user.email])
        req.domainUserId = rows[0]?.id ?? null
      }
    } catch { }
  }
  next()
}

export function requireSession(req, res, next) {
  if (!auth) return fail(res, 400, 'Auth is not enabled')
  if (!req.sessionUser) return fail(res, 401, 'Sign in required')
  next()
}

export function requireActor(field = 'user_id') {
  return (req, res, next) => {
    if (!auth) {
      const bodyUserId = req.body?.[field]
      if (!bodyUserId) return fail(res, 400, `${field} is required`)
      req.actorId = Number(bodyUserId)
      return next()
    }
    if (!req.sessionUser) return fail(res, 401, 'Sign in required')
    if (!req.domainUserId) return fail(res, 403, 'No profile for this account yet — finish signing up')
    req.actorId = req.domainUserId
    next()
  }
}
