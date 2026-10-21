import { ZodError } from 'zod'
import { fail } from '../lib/respond.js'

function createValidator(source, schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source] ?? {})

      if (source === 'query') {
        Object.defineProperty(req, 'query', {
          value: parsed,
          writable: true,
          configurable: true,
          enumerable: true,
        })
      } else {
        req[source] = parsed
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return fail(res, 400, error.issues[0]?.message || 'Invalid request')
      }
      next(error)
    }
  }
}

export const validateBody = (schema) => createValidator('body', schema)
export const validateParams = (schema) => createValidator('params', schema)
export const validateQuery = (schema) => createValidator('query', schema)
