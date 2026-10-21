import { z } from 'zod'

export const createApplicationBodySchema = z.object({
  gig_id: z.coerce.number({ error: 'gig_id is required' })
    .int({ error: 'gig_id is required' })
    .positive({ error: 'gig_id is required' }),
  message: z.string({ error: 'A short application message is required' })
    .trim()
    .min(1, { error: 'A short application message is required' }),
})

export const updateApplicationBodySchema = z.object({
  status: z.enum(['Accepted', 'Rejected'], { error: 'status must be Accepted or Rejected' }),
})
