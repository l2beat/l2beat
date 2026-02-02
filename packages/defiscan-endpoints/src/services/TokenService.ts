import type { Logger } from '@l2beat/backend-tools'
import type { DebankClient } from '../clients/DebankClient'
import type { TokenInfoResponse } from '../types/api'
import type { Cache } from '../utils/cache'

export interface TokenResult {
  data: TokenInfoResponse
  cached: boolean
}

export class TokenService {
  constructor(
    private readonly debankClient: DebankClient,
    private readonly cache: Cache<TokenInfoResponse>,
    private readonly logger: Logger,
  ) {}

  async getTokenInfo(
    chainId: string,
    tokenId: string,
  ): Promise<TokenResult> {
    const cacheKey = `token:${chainId}:${tokenId.toLowerCase()}`

    const cached = this.cache.get(cacheKey)
    if (cached) {
      this.logger.info('CACHE HIT - Returning cached token info', {
        chainId,
        tokenId,
      })
      return { data: cached, cached: true }
    }

    this.logger.info('FETCHING - Getting token info from DeBank', {
      chainId,
      tokenId,
    })

    const debankToken = await this.debankClient.getTokenInfo(chainId, tokenId)

    const response: TokenInfoResponse = {
      id: debankToken.id,
      chain: debankToken.chain,
      name: debankToken.name,
      symbol: debankToken.symbol,
      decimals: debankToken.decimals,
      price: debankToken.price,
    }

    this.cache.set(cacheKey, response)

    return { data: response, cached: false }
  }
}
