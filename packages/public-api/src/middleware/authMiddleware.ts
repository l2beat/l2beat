import type { Logger } from '@l2beat/backend-tools'
import type { NextFunction, Request, Response } from 'express'
import type { AuthConfig } from '../config/Config'
import { requestContext } from '../context/context'
import { getParamsWithoutApiKey } from './loggerMiddleware'

export function authMiddleware(config: AuthConfig, logger: Logger) {
  logger = logger.for('Auth')
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.query.apiKey

    const user = Object.entries(config.apiKeys).find(
      ([_, value]) => value === apiKey?.toString(),
    )?.[0]

    if (!user) {
      const { url, queryParams } = getParamsWithoutApiKey(req.originalUrl)
      logger.warn('Unauthorized request', {
        method: req.method,
        url,
        queryParams,
        referer: req.headers.referer ?? 'unknown',
        userAgent: req.headers['user-agent'] ?? 'unknown',
      })
      res.status(401).json({
        message: 'Unauthorized. Use apiKey query parameter with valid API key.',
      })
      return
    }

    requestContext.run({ user }, next)
  }
}
