import { randomUUID } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import { getRequestIp } from '../utils/getRequestIp'
import { getLogger } from '../utils/logger'
import { getRequestId } from './RequestIdMiddleware'

export function ErrorHandler() {
  const logger = getLogger().for('ErrorHandler')
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error)
    }

    const errorId = randomUUID()
    res.status(500)

    const body = {
      requestId: getRequestId(req),
      ip: getRequestIp(req),
      error,
      method: req.method,
      url: req.originalUrl,
      errorId,
      status: res.statusCode,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    }

    const message = error.message || 'Error processing request'
    if (
      error instanceof URIError &&
      error.message.startsWith('Failed to decode')
    ) {
      logger.warn(message, body)
    } else {
      logger.error(message, body)
    }
    res.send(`Internal Server Error\n\n Error ID: ${errorId}`)
  }
}
