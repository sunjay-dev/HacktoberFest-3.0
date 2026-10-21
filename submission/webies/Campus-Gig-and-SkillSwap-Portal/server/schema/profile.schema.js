import { z } from 'zod'

const skillsSchema = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (Array.isArray(value)) return value
    if (!value) return []
    return value.split(',').map((skill) => skill.trim()).filter(Boolean)
  })

export const profileBodySchema = z.object({
  major: z.string({ error: 'Major is required' }).trim().min(1, { error: 'Major is required' }),
  semester: z.coerce.number({ error: 'Semester must be between 1 and 12' })
    .int({ error: 'Semester must be between 1 and 12' })
    .min(1, { error: 'Semester must be between 1 and 12' })
    .max(12, { error: 'Semester must be between 1 and 12' }),
  bio: z.string({ error: 'Bio must be text' }).optional().default('').transform((value) => value.trim()),
  skills: skillsSchema,
})
