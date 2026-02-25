import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import type { MorphoRpcClient } from '../clients/MorphoRpcClient'
import type { PositionResponse } from '../types/api'
import type { DebankComplexProtocol } from '../types/debank'
import type { Cache } from '../utils/cache'
import type { BalanceService } from './BalanceService'

const MORPHO_BLUE_ADDRESS = EthereumAddress(
  '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
)

export interface MorphoPositionResult {
  data: PositionResponse
  cached: boolean
}

interface TokenPriceInfo {
  price: number
  symbol: string
  name: string
  decimals: number
}

export class MorphoVaultService {
  constructor(
    private readonly morphoClient: MorphoRpcClient,
    private readonly balanceService: BalanceService,
    private readonly cache: Cache<PositionResponse>,
    private readonly vaultDetectionCache: Cache<boolean>,
    private readonly logger: Logger,
  ) {}

  async isMorphoVault(address: EthereumAddress): Promise<boolean> {
    const cacheKey = `morpho-vault:${address}`
    const cached = this.vaultDetectionCache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    const isVault = await this.morphoClient.isMetaMorphoVault(address)
    this.vaultDetectionCache.set(cacheKey, isVault)
    return isVault
  }

  async getPositions(
    address: EthereumAddress,
    chainId?: string,
    forceRefresh?: boolean,
  ): Promise<MorphoPositionResult> {
    const chain = chainId ?? 'eth'
    const cacheKey = `positions:${address}:${chain}`

    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.logger.info('CACHE HIT - Returning cached Morpho positions', {
          address,
        })
        return { data: cached, cached: true }
      }
    }

    this.logger.info('FETCHING - Getting Morpho vault positions onchain', {
      address,
    })

    // Step 1: Fetch onchain positions
    const positions = await this.morphoClient.getVaultPositions(address)

    if (positions.length === 0) {
      const emptyResult: PositionResponse = []
      this.cache.set(cacheKey, emptyResult)
      return { data: emptyResult, cached: false }
    }

    // Step 2: Get token prices from Morpho Blue singleton balances
    const tokenPrices = await this.getTokenPrices()

    // Step 3: Format as DebankComplexProtocol[]
    const portfolioItems = positions.map((pos) => {
      const loanTokenLower = pos.loanToken.toLowerCase()
      const tokenInfo = tokenPrices.get(loanTokenLower)

      const decimals = tokenInfo?.decimals ?? 18
      const price = tokenInfo?.price ?? 0
      const symbol = tokenInfo?.symbol ?? 'UNKNOWN'
      const name = tokenInfo?.name ?? 'Unknown Token'

      if (!tokenInfo) {
        this.logger.warn(
          'Loan token not found in Morpho Blue balances, using price=0',
          { loanToken: pos.loanToken },
        )
      }

      // Convert raw suppliedAssets to human-readable amount
      const amount = Number(pos.suppliedAssets) / 10 ** decimals

      const usdValue = amount * price

      return {
        name: 'Supply',
        stats: {
          asset_usd_value: usdValue,
          debt_usd_value: 0,
          net_usd_value: usdValue,
        },
        asset_token_list: [
          {
            id: pos.loanToken.toLowerCase(),
            chain: 'eth',
            name,
            symbol,
            decimals,
            amount,
            price,
          },
        ],
      }
    })

    const protocol: DebankComplexProtocol = {
      id: 'morphoblue',
      chain: 'eth',
      name: 'Morpho Blue',
      portfolio_item_list: portfolioItems,
    }

    const result: PositionResponse = [protocol]
    this.cache.set(cacheKey, result)

    this.logger.info('Morpho vault positions fetched successfully', {
      address,
      markets: positions.length,
      totalUsd: portfolioItems.reduce(
        (sum, item) => sum + item.stats.net_usd_value,
        0,
      ),
    })

    return { data: result, cached: false }
  }

  private async getTokenPrices(): Promise<Map<string, TokenPriceInfo>> {
    const balanceResult =
      await this.balanceService.getBalances(MORPHO_BLUE_ADDRESS)
    const priceMap = new Map<string, TokenPriceInfo>()

    for (const token of balanceResult.data.balances) {
      const rawAmount = Number(token.balance) / 10 ** token.decimals
      const price = rawAmount > 0 ? token.usd_value / rawAmount : 0

      priceMap.set(token.asset_address.toLowerCase(), {
        price,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
      })
    }

    return priceMap
  }
}
