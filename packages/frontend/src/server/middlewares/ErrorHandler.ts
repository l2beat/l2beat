import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'

export function ErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
  appLogger: Logger,
) {
  res.status(500)
  appLogger.error('Error processing request', {
    error: err instanceof Error ? err.message : String(err),
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
  })
  res.send('Internal Server Error')
}
