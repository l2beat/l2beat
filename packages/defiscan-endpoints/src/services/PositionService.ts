import type { Logger } from '@l2beat/backend-tools'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { DebankClient } from '../clients/DebankClient'
import type { PositionResponse } from '../types/api'
import type { Cache } from '../utils/cache'

export class PositionService {
  constructor(
    private readonly debankClient: DebankClient,
    private readonly cache: Cache<PositionResponse>,
    private readonly logger: Logger,
  ) {}

  async getPositions(
    address: EthereumAddress,
    chainId?: string,
  ): Promise<PositionResponse> {
    // Default to Ethereum mainnet if no chain specified
    const chain = chainId ?? 'eth'
    const cacheKey = `positions:${address}:${chain}`

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      this.logger.info('Position cache hit', { address, chain })
      return cached
    }

    this.logger.info('Fetching positions from DeBank', { address, chain })

    // Fetch from DeBank - currently returns raw data
    // In the future, we can add transformation here
    const result = await this.debankClient.getComplexProtocols(address, chain)

    // Cache the result
    this.cache.set(cacheKey, result)

    return result
  }
}
