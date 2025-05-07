import type { RequestHandler } from 'express'
import type { AnyZodObject, z } from 'zod'

export function validateRoute<
  TParams extends AnyZodObject,
  TQuery extends AnyZodObject,
>(schema: {
  params?: TParams
  query?: TQuery
}): RequestHandler<z.infer<TParams>, unknown, unknown, z.infer<TQuery>> {
  return async (req, res, next): Promise<void> => {
    for (const key in schema) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const keySchema = schema[key as keyof typeof schema]!
      const result = keySchema.safeParse(req.params)
      if (result.success) req[key as keyof typeof schema] = result.data
      if (!result.success) {
        res.status(400).json({ error: result.error })
        return
      }
    }

    return next()
  }
}
