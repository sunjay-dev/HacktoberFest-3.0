import { z } from 'zod'
import { CATEGORIES, PAYMENT_TYPES, TYPES } from '../config.js'

const budgetSchema = z.union([z.literal(''), z.null(), z.coerce.number()]).optional()

const deadlineSchema = z.string({ error: 'A valid deadline is required' })
  .refine((value) => !Number.isNaN(Date.parse(value)), { error: 'A valid deadline is required' })
  .refine((value) => new Date(value) >= new Date(new Date().toISOString().slice(0, 10)), { error: 'Deadline cannot be in the past' })

export const createGigBodySchema = z.object({
  title: z.string({ error: 'Title is required' }).trim().min(1, { error: 'Title is required' }),
  description: z.string({ error: 'Description is required' }).trim().min(1, { error: 'Description is required' }),
  type: z.enum(TYPES, { error: `Type must be one of: ${TYPES.join(', ')}` }),
  category: z.enum(CATEGORIES, { error: `Category must be one of: ${CATEGORIES.join(', ')}` }),
  payment_type: z.enum(PAYMENT_TYPES, { error: `Payment type must be one of: ${PAYMENT_TYPES.join(', ')}` }),
  budget: budgetSchema,
  deadline: deadlineSchema,
}).superRefine((value, ctx) => {
  if (value.payment_type === 'Paid') {
    if (!(typeof value.budget === 'number' && value.budget > 0)) {
      ctx.addIssue({ code: 'custom', path: ['budget'], message: 'Budget is required for paid gigs' })
    }
  } else if (value.budget !== null && value.budget !== undefined && value.budget !== '') {
    ctx.addIssue({ code: 'custom', path: ['budget'], message: 'Budget is only allowed for paid gigs' })
  }
})

export const updateGigBodySchema = z.object({
  status: z.string({ error: 'status is required' }).min(1, { error: 'status is required' }),
})

export const gigQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  payment_type: z.string().optional(),
  min_budget: z.coerce.number({ error: 'min_budget must be a number' })
    .nonnegative({ error: 'min_budget cannot be negative' })
    .optional(),
  max_budget: z.coerce.number({ error: 'max_budget must be a number' })
    .nonnegative({ error: 'max_budget cannot be negative' })
    .optional(),
  status: z.string().optional(),
})
