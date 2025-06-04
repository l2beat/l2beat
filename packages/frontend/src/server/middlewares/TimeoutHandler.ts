import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'

export function TimeoutHandler(appLogger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on('timeout', () => {
      appLogger.error('Request timed out', {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        referer: req.headers.referer ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
      })
      res.status(524).send('Request timed out')
    })
    next()
  }
}
