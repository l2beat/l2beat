import { randomUUID } from 'node:crypto'
import { STATUS_CODES } from 'node:http'
import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'
import { getRequestIp } from '../utils/getRequestIp'
import { getRequestId } from './RequestIdMiddleware'

const INTERNAL_SERVER_ERROR = 500

export function ErrorHandler(baseLogger: Logger) {
  const logger = baseLogger.for('ErrorHandler')
  return (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error)
    }

    const errorId = randomUUID()
    res.status(clientErrorStatus(error) ?? INTERNAL_SERVER_ERROR)

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
    if (res.statusCode < INTERNAL_SERVER_ERROR) {
      logger.warn(message, body)
    } else {
      logger.error(message, body)
    }

    const statusText = STATUS_CODES[res.statusCode] ?? 'Error'
    res.send(`${statusText}\n\n Error ID: ${errorId}`)
  }
}

/**
 * Rejections of a malformed request carry their own status: the router sets 400
 * when a path param cannot be percent-decoded, body-parser sets 400 and 413.
 * Answering those with 500 turns client mistakes into server-failure alerts.
 */
export function clientErrorStatus(error: Error): number | undefined {
  const { status, statusCode } = error as {
    status?: unknown
    statusCode?: unknown
  }
  const declared = typeof status === 'number' ? status : statusCode

  if (typeof declared !== 'number') {
    return undefined
  }
  if (!Number.isInteger(declared)) {
    return undefined
  }
  if (declared < 400 || declared > 499) {
    return undefined
  }
  return declared
}
