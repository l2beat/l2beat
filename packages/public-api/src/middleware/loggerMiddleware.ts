import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'
import { getContext } from '../context/context'

export function loggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const context = getContext()
    logger.info('Processing request', {
      method: req.method,
      url: req.originalUrl,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
      user: context.user,
    })

    const start = process.hrtime.bigint()
    res.once('finish', () => {
      const end = process.hrtime.bigint()
      const durationMs = Number(end - start) / 1_000_000
      const contentLength = res.getHeader('Content-Length')
      logger.info('Request processed', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: Math.round(durationMs),
        size: contentLength ? Number(contentLength) : undefined,
        referer: req.headers.referer ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
        user: context.user,
      })
    })

    next()
  }
}
