import { Router } from 'express'
import { createApplication, listApplications, updateApplication } from '../controllers/applications.controller.js'
import { requireActor } from '../middleware/auth.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { idParamsSchema } from '../schema/common.schema.js'
import { createApplicationBodySchema, updateApplicationBodySchema } from '../schema/application.schema.js'

const router = Router()

router.get('/', listApplications)
router.post('/', requireActor('applicant_id'), validateBody(createApplicationBodySchema), createApplication)
router.patch('/:id', requireActor(), validateParams(idParamsSchema), validateBody(updateApplicationBodySchema), updateApplication)

export default router
