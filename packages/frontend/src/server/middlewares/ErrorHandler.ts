import { randomUUID } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import { getLogger } from '../utils/logger'

export function ErrorHandler() {
  const logger = getLogger().for('ErrorHandler')
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err)
    }

    const errorId = randomUUID()
    res.status(500)

    const body = {
      error: err instanceof Error ? err.message : String(err),
      method: req.method,
      url: req.originalUrl,
      errorId,
      status: res.statusCode,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    }

    if (err instanceof URIError && err.message.startsWith('Failed to decode')) {
      logger.warn('Error processing request', body)
    } else {
      logger.error('Error processing request', body)
    }
    res.send(`Internal Server Error\n\n Error ID: ${errorId}`)
  }
}
