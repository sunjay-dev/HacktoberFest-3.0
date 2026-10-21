import { Router } from 'express'
import { createGig, getGigById, listGigs, updateGigStatus } from '../controllers/gigs.controller.js'
import { requireActor } from '../middleware/auth.js'
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js'
import { idParamsSchema } from '../schema/common.schema.js'
import { createGigBodySchema, gigQuerySchema, updateGigBodySchema } from '../schema/gig.schema.js'

const router = Router()

router.get('/', validateQuery(gigQuerySchema), listGigs)
router.get('/:id', validateParams(idParamsSchema), getGigById)
router.post('/', requireActor(), validateBody(createGigBodySchema), createGig)
router.patch('/:id', requireActor(), validateParams(idParamsSchema), validateBody(updateGigBodySchema), updateGigStatus)

export default router
