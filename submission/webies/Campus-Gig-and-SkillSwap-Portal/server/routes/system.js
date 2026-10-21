import { Router } from 'express'
import { getHealth, getStats } from '../controllers/system.controller.js'

const router = Router()

router.get('/health', getHealth)
router.get('/stats', getStats)

export default router
