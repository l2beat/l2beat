import type { Parser } from '@l2beat/validate'
import type { RequestHandler } from 'express'

const keys = ['params', 'query', 'body'] as const

export function validateRoute<P, Q, B>(schema: {
  params?: Parser<P>
  query?: Parser<Q>
  body?: Parser<B>
}): RequestHandler<P, unknown, B, Q> {
  return (req, res, next) => {
    for (const key of keys) {
      const result = schema[key]?.safeParse(req[key])
      if (!result) {
        continue
      }
      if (!result.success) {
        res
          .status(400)
          .json({ path: `.${key}${result.path}`, error: result.message })
        return
      }
      // We need to do this, because the property might be read-only
      Object.defineProperty(req, key, { value: result.data })
    }

    return next()
  }
}
