import type { Logger } from '@l2beat/backend-tools'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { DebankClient } from '../clients/DebankClient'
import type { PositionResponse } from '../types/api'
import type { Cache } from '../utils/cache'

export interface PositionResult {
  data: PositionResponse
  cached: boolean
}

export class PositionService {
  constructor(
    private readonly debankClient: DebankClient,
    private readonly cache: Cache<PositionResponse>,
    private readonly logger: Logger,
  ) {}

  async getPositions(
    address: EthereumAddress,
    chainId?: string,
    forceRefresh?: boolean,
  ): Promise<PositionResult> {
    // Default to Ethereum mainnet if no chain specified
    const chain = chainId ?? 'eth'
    const cacheKey = `positions:${address}:${chain}`

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.logger.info('CACHE HIT - Returning cached positions', { address, chain })
        return { data: cached, cached: true }
      }
    } else {
      this.logger.info('FORCE REFRESH - Bypassing cache', { address, chain })
    }

    this.logger.info('FETCHING - Getting positions from DeBank', { address, chain })

    // Fetch from DeBank - currently returns raw data
    // In the future, we can add transformation here
    const result = await this.debankClient.getComplexProtocols(address, chain)

    // Cache the result
    this.cache.set(cacheKey, result)

    return { data: result, cached: false }
  }
}
