import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import express, { type Router } from 'express'
import type { AggregateService } from '../services/aggregate/AggregateService'

export function aggregateRouter(
  aggregateService: AggregateService,
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
        const { contract_address, handler, chain_id, force_refresh } =
          req.query

        // Validate contract_address
        if (!contract_address || typeof contract_address !== 'string') {
          return res.status(400).json({
            error: 'Invalid contract_address parameter',
            message:
              'contract_address is required and must be a valid Ethereum address',
          })
        }

        let contractAddr: EthereumAddress
        try {
          contractAddr = EthereumAddress(contract_address)
        } catch (error) {
          return res.status(400).json({
            error: 'Invalid contract_address parameter',
            message: 'contract_address must be a valid Ethereum address',
          })
        }

        // Validate handler
        if (!handler || typeof handler !== 'string') {
          return res.status(400).json({
            error: 'Invalid handler parameter',
            message: `handler is required. Available handlers: ${aggregateService.getHandlerNames().join(', ')}`,
          })
        }

        const chainId =
          chain_id && typeof chain_id === 'string' ? chain_id : undefined
        const forceRefresh = force_refresh === 'true'

        const result = await aggregateService.getAggregate(
          contractAddr,
          handler,
          chainId,
          forceRefresh,
        )

        res.json({
          ...result.data,
          cached: result.cached,
        })
      } catch (error) {
        logger.error('Error fetching aggregate data', error)
        next(error)
      }
    },
  )

  return router
}
