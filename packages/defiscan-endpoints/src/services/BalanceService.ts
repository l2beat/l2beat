import type { Logger } from '@l2beat/backend-tools'
import type { EthereumAddress } from '@l2beat/shared-pure'
import type { DebankClient } from '../clients/DebankClient'
import type { BalanceResponse, TokenBalance } from '../types/api'
import type { Cache } from '../utils/cache'

export interface BalanceResult {
  data: BalanceResponse
  cached: boolean
}

export class BalanceService {
  constructor(
    private readonly debankClient: DebankClient,
    private readonly cache: Cache<BalanceResponse>,
    private readonly logger: Logger,
  ) {}

  async getBalances(
    contractAddress: EthereumAddress,
    assetAddresses?: EthereumAddress[],
    chainId?: string,
    forceRefresh?: boolean,
  ): Promise<BalanceResult> {
    // Default to Ethereum mainnet if no chain specified
    const chain = chainId ?? 'eth'
    const cacheKey = `balances:${contractAddress}:${chain}:${assetAddresses?.join(',') ?? 'all'}`

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.logger.info('CACHE HIT - Returning cached balances', { contractAddress, chain, timestamp: cached.timestamp })
        return { data: cached, cached: true }
      }
    } else {
      this.logger.info('FORCE REFRESH - Bypassing cache', { contractAddress, chain })
    }

    this.logger.info('FETCHING - Getting balances from DeBank', { contractAddress, chain })

    // Fetch from DeBank
    const debankBalances =
      await this.debankClient.getTokenBalances(contractAddress, chain)

    // Filter by asset addresses if provided
    const filteredBalances = assetAddresses
      ? debankBalances.filter((b) =>
          assetAddresses.includes(b.id as EthereumAddress),
        )
      : debankBalances

    // Transform to our API format
    const balances: TokenBalance[] = filteredBalances.map((b) => ({
      asset_address: b.id,
      balance: String(Math.floor(b.amount * 10 ** b.decimals)),
      decimals: b.decimals,
      symbol: b.optimized_symbol ?? b.symbol,
      name: b.name,
      usd_value: b.amount * b.price,
    }))

    const response: BalanceResponse = {
      contract_address: contractAddress,
      balances,
      total_usd_value: balances.reduce((sum, b) => sum + b.usd_value, 0),
      timestamp: new Date().toISOString(),
      source: 'debank',
    }

    // Cache the result
    this.cache.set(cacheKey, response)

    return { data: response, cached: false }
  }
}
