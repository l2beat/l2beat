import type { NextFunction, Request, Response } from 'express'
import type { AuthConfig } from '../config/Config'
import { requestContext } from '../context/context'

export function authMiddleware(config: AuthConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.query.apiKey

    const user = Object.entries(config.apiKeys).find(
      ([_, value]) => value === apiKey?.toString(),
    )?.[0]

    if (!user) {
      res.status(401).json({
        message: 'Unauthorized. Use apiKey query parameter with valid API key.',
      })
      return
    }

    requestContext.run({ user }, next)
  }
}
