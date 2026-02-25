import type { Logger } from '@l2beat/backend-tools'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { DebankClient } from '../clients/DebankClient'
import type { PositionResponse } from '../types/api'
import type { Cache } from '../utils/cache'
import type { MorphoVaultService } from './MorphoVaultService'

export interface PositionResult {
  data: PositionResponse
  cached: boolean
  source: 'debank' | 'onchain/debank'
}

export class PositionService {
  constructor(
    private readonly debankClient: DebankClient,
    private readonly cache: Cache<PositionResponse>,
    private readonly logger: Logger,
    private readonly morphoVaultService?: MorphoVaultService,
  ) {}

  async getPositions(
    address: EthereumAddress,
    chainId?: string,
    forceRefresh?: boolean,
  ): Promise<PositionResult> {
    // Default to Ethereum mainnet if no chain specified
    const chain = chainId ?? 'eth'
    const cacheKey = `positions:${address}:${chain}`

    // Try Morpho vault onchain fetching for Ethereum mainnet
    if (this.morphoVaultService && chain === 'eth') {
      try {
        const isMorpho = await this.morphoVaultService.isMorphoVault(address)
        if (isMorpho) {
          this.logger.info(
            'Detected Morpho vault, fetching onchain positions',
            { address },
          )
          const morphoResult = await this.morphoVaultService.getPositions(
            address,
            chainId,
            forceRefresh,
          )
          return { ...morphoResult, source: 'onchain/debank' }
        }
      } catch (error) {
        this.logger.warn(
          'Morpho vault detection/fetch failed, falling back to DeBank',
          {
            address,
            error: error instanceof Error ? error.message : String(error),
          },
        )
      }
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.logger.info('CACHE HIT - Returning cached positions', {
          address,
          chain,
        })
        return { data: cached, cached: true, source: 'debank' }
      }
    } else {
      this.logger.info('FORCE REFRESH - Bypassing cache', { address, chain })
    }

    this.logger.info('FETCHING - Getting positions from DeBank', {
      address,
      chain,
    })

    // Fetch from DeBank
    const result = await this.debankClient.getComplexProtocols(address, chain)

    // Cache the result
    this.cache.set(cacheKey, result)

    return { data: result, cached: false, source: 'debank' }
  }
}
