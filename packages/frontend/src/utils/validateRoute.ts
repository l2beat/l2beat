import { assert } from '@l2beat/shared-pure'
import type { RequestHandler } from 'express'
import type { AnyZodObject, z } from 'zod'

export function validateRoute<
  TParams extends AnyZodObject,
  TQuery extends AnyZodObject,
  TBody extends AnyZodObject,
>(schema: {
  params?: TParams
  query?: TQuery
  body?: TBody
}): RequestHandler<z.infer<TParams>, unknown, z.infer<TBody>, z.infer<TQuery>> {
  return async (req, res, next): Promise<void> => {
    for (const key in schema) {
      assert(key === 'params' || key === 'query' || key === 'body')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const keySchema = schema[key]!
      const result = keySchema.safeParse(req[key])
      if (!result.success) {
        res.status(400).json({ error: result.error })
        return
      }
    }

    return next()
  }
}
