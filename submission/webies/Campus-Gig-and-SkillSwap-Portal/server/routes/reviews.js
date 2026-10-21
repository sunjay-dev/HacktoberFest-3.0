import { Router } from 'express'
import { createReview, listReviews } from '../controllers/reviews.controller.js'
import { requireActor } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { createReviewBodySchema } from '../schema/review.schema.js'

const router = Router()

router.get('/', listReviews)
router.post('/', requireActor('reviewer_id'), validateBody(createReviewBodySchema), createReview)

export default router
