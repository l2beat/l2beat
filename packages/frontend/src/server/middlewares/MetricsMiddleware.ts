import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'

export function MetricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
  logger: Logger,
) {
  const appLogger = logger.for('Metrics')
  appLogger.info(`Processing request`, {
    method: req.method,
    url: req.originalUrl,
  })

  const start = process.hrtime.bigint()

  const originalSend = res.send

  res.send = function (body) {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1_000_000

    let size
    if (body === undefined || body === null) {
      size = 0
    } else if (Buffer.isBuffer(body)) {
      size = body.length
    } else if (typeof body === 'string') {
      size = Buffer.byteLength(body)
    } else {
      const jsonString = JSON.stringify(body)
      size = Buffer.byteLength(jsonString)
    }

    res.setHeader('metrics-execution-time', durationMs.toFixed(2))
    res.setHeader('metrics-data-size', size)
    appLogger.info(`Request processed`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Math.round(durationMs),
      size,
    })

    return originalSend.call(this, body)
  }

  next()
}
