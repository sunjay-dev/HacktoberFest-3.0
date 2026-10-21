import { Router } from 'express'
import { createProfile, getMe, updateProfile } from '../controllers/profile.controller.js'
import { requireSession } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { profileBodySchema } from '../schema/profile.schema.js'

const router = Router()

router.get('/me', getMe)
router.post('/profile', requireSession, validateBody(profileBodySchema), createProfile)
router.patch('/profile', requireSession, validateBody(profileBodySchema), updateProfile)

export default router
