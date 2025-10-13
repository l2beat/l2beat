import { assert } from '@l2beat/shared-pure'
import type { NextFunction, Request, Response } from 'express'
import type { AuthConfig } from '../config/Config'
import { requestContext } from '../context/context'

export function authMiddleware(config: AuthConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.query.apiKey
    if (!apiKey || !Object.values(config.apiKeys).includes(apiKey.toString())) {
      res.status(401).json({
        message: 'Unauthorized. Use apiKey query parameter with valid API key.',
      })
      return
    }

    const user = Object.entries(config.apiKeys).find(
      ([_, value]) => value === apiKey.toString(),
    )?.[0]
    assert(user, 'User not found')

    requestContext.run({ user }, next)
  }
}
