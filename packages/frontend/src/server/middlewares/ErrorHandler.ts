import { randomUUID } from 'crypto'
import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'

export function ErrorHandler(appLogger: Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err)
    }

    const errorId = randomUUID()
    res.status(500)
    appLogger.error('Error processing request', {
      error: err instanceof Error ? err.message : String(err),
      method: req.method,
      url: req.originalUrl,
      errorId,
      status: res.statusCode,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    })
    res.send(`Internal Server Error\n\n Error ID: ${errorId}`)
  }
}
