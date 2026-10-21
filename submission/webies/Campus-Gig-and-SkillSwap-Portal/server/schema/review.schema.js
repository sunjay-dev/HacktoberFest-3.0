import { z } from 'zod'

export const createReviewBodySchema = z.object({
  gig_id: z.coerce.number({ error: 'gig_id is required' })
    .int({ error: 'gig_id is required' })
    .positive({ error: 'gig_id is required' }),
  rating: z.coerce.number({ error: 'Rating must be between 1 and 5' })
    .min(1, { error: 'Rating must be between 1 and 5' })
    .max(5, { error: 'Rating must be between 1 and 5' }),
  comment: z.string({ error: 'Comment must be text' }).optional().default('').transform((value) => value.trim()),
})
