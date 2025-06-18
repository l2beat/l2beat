import { assert } from '@l2beat/shared-pure'
import type { Parser, Validator, v as z } from '@l2beat/validate'
import type { RequestHandler } from 'express'

export function validateRoute<
  TP,
  TParams extends Validator<TP> | Parser<TP>,
  TQ,
  TQuery extends Validator<TQ> | Parser<TQ>,
  TB,
  TBody extends Validator<TB> | Parser<TB>,
>(schema: {
  params?: TParams
  query?: TQuery
  body?: TBody
}): RequestHandler<z.infer<TParams>, unknown, z.infer<TBody>, z.infer<TQuery>> {
  return (req, res, next) => {
    for (const key in schema) {
      assert(key === 'params' || key === 'query' || key === 'body')
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      const keySchema = schema[key]!
      const result = keySchema.safeParse(req[key])
      if (!result.success) {
        res.status(400).json({ error: result.message })
        return
      }
    }

    return next()
  }
}
