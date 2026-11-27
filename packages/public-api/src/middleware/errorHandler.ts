import type { Logger } from '@l2beat/backend-tools'
import { randomUUID } from 'crypto'
import type { NextFunction, Request, Response } from 'express'
import { CACHE_CONTROL_ERROR } from '../OpenApi'
import type {
  BadRequestResponse,
  GenericErrorResponse,
  InternalErrorResponse,
} from '../types'
import { getParamsWithoutApiKey } from './loggerMiddleware'

/** Answers a request no route matched, in the JSON shape of every other error. */
export function notFoundHandler() {
  return (req: Request, res: Response<GenericErrorResponse>) => {
    res.setHeader('Cache-Control', CACHE_CONTROL_ERROR)
    res.status(404).json({
      message: `No endpoint at ${req.path}. The endpoints are listed at /docs.`,
    })
  }
}

export function errorHandler(logger: Logger) {
  logger = logger.for('ErrorHandler')
  return (
    err: Error,
    req: Request,
    res: Response<BadRequestResponse | InternalErrorResponse>,
    next: NextFunction,
  ) => {
    if (res.headersSent) {
      return next(err)
    }

    // Express fails a path with broken percent-encoding before any route
    // sees it. That is the caller's mistake, not ours.
    const isUnreadablePath =
      err instanceof URIError && err.message.startsWith('Failed to decode')
    const errorId = randomUUID()
    res.status(isUnreadablePath ? 400 : 500)
    res.setHeader('Cache-Control', CACHE_CONTROL_ERROR)

    const { url, queryParams } = getParamsWithoutApiKey(req.originalUrl)
    const body = {
      error: err instanceof Error ? err : new Error(String(err)),
      method: req.method,
      url,
      queryParams,
      errorId,
      status: res.statusCode,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    }

    if (isUnreadablePath) {
      logger.warn('Error processing request', body)
      res.json({
        path: '.params',
        message: 'The path has broken percent-encoding.',
      })
      return
    }
    logger.error('Error processing request', body)
    res.json({ message: 'Internal server error', errorId })
  }
}
