import { Router } from 'express'
import { getUser, listUsers } from '../controllers/users.controller.js'
import { validateParams } from '../middleware/validate.js'
import { idParamsSchema } from '../schema/common.schema.js'

const router = Router()

router.get('/', listUsers)
router.get('/:id', validateParams(idParamsSchema), getUser)

export default router
