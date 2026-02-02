import type { Logger } from '@l2beat/backend-tools'
import express, { type Router } from 'express'
import type { TokenService } from '../services/TokenService'

export function tokenRouter(
  tokenService: TokenService,
  logger: Logger,
): Router {
  const router: Router = express.Router()

  router.get(
    '/',
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      try {
        const { chain_id, id } = req.query

        if (!chain_id || typeof chain_id !== 'string') {
          return res.status(400).json({
            error: 'Invalid chain_id parameter',
            message:
              'chain_id is required (e.g. "eth", "bsc", "matic")',
          })
        }

        if (!id || typeof id !== 'string') {
          return res.status(400).json({
            error: 'Invalid id parameter',
            message:
              'id is required and must be a token contract address or native token identifier',
          })
        }

        const result = await tokenService.getTokenInfo(chain_id, id)

        res.setHeader('X-Cached', result.cached.toString())
        res.json(result.data)
      } catch (error) {
        logger.error('Error fetching token info', error)
        next(error)
      }
    },
  )

  return router
}
