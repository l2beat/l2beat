import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import express, { type Router } from 'express'
import type { BalanceService } from '../services/BalanceService'

export function balancesRouter(
  balanceService: BalanceService,
  logger: Logger,
): Router {
  const router: Router = express.Router()

  router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { contract_address, asset_addresses, chain_id } = req.query

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

      // Parse optional asset_addresses
      let assetAddrs: EthereumAddress[] | undefined
      if (asset_addresses && typeof asset_addresses === 'string') {
        try {
          assetAddrs = asset_addresses
            .split(',')
            .map((addr) => EthereumAddress(addr.trim()))
        } catch (error) {
          return res.status(400).json({
            error: 'Invalid asset_addresses parameter',
            message:
              'asset_addresses must be comma-separated valid Ethereum addresses',
          })
        }
      }

      // Parse optional chain_id
      const chainId = chain_id && typeof chain_id === 'string' ? chain_id : undefined

      // Fetch balances
      const result = await balanceService.getBalances(contractAddr, assetAddrs, chainId)

      res.json(result)
    } catch (error) {
      logger.error('Error fetching balances', error)
      next(error)
    }
  })

  return router
}
