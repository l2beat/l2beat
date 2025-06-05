import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'

export function MetricsMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const appLogger = logger.for('Metrics')
    appLogger.info(`Processing request`, {
      method: req.method,
      url: req.originalUrl,
      referer: req.headers.referer ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    })

    const start = process.hrtime.bigint()
    res.once('finish', () => {
      const end = process.hrtime.bigint()
      const durationMs = Number(end - start) / 1_000_000

      appLogger.info(`Request processed`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: Math.round(durationMs),
        size: res.getHeader('Content-Length') ?? 0,
        referer: req.headers.referer ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
      })
    })

    next()
  }
}
