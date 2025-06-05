import type { NextFunction, Request, Response } from 'express'
import { getExpressHelpers } from '~/trpc/server'

export function ContextMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  req.context = {
    helpers: getExpressHelpers(),
  }
  next()
}
