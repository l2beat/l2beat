import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import express, { type Router } from 'express'
import type { PositionService } from '../services/PositionService'

export function positionsRouter(
  positionService: PositionService,
  logger: Logger,
): Router {
  const router: Router = express.Router()

  router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { address, chain_id } = req.query

      // Validate address
      if (!address || typeof address !== 'string') {
        return res.status(400).json({
          error: 'Invalid address parameter',
          message: 'address is required and must be a valid Ethereum address',
        })
      }

      let addr: EthereumAddress
      try {
        addr = EthereumAddress(address)
      } catch (error) {
        return res.status(400).json({
          error: 'Invalid address parameter',
          message: 'address must be a valid Ethereum address',
        })
      }

      // Parse optional chain_id
      const chainId = chain_id && typeof chain_id === 'string' ? chain_id : undefined

      // Fetch positions
      const result = await positionService.getPositions(addr, chainId)

      res.json(result)
    } catch (error) {
      logger.error('Error fetching positions', error)
      next(error)
    }
  })

  return router
}
