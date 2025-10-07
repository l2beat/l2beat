import type { PriceProvider } from '@l2beat/shared'
import { assert, type CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { BigIntWithDecimals } from '../../tvs/tools/bigIntWithDecimals'
import type {
  BridgeTransfer,
  BridgeTransferWithFinancials,
  TransferSideWithFinancials,
} from '../plugins/types'
import type { InteropToken } from './tokens'

interface CachedPrice {
  value: number
  timestamp: number
}

export class FinancialsService {
  tokensMap: Map<
    string,
    {
      coingeckoId: CoingeckoId
      symbol: string
      decimals: number
    }
  >

  private priceCache = new Map<string, CachedPrice>()

  constructor(
    tokens: InteropToken[],
    private readonly priceProvider: PriceProvider,
  ) {
    this.tokensMap = new Map(
      tokens
        .flatMap((t) =>
          t.addresses.map((tt) => ({
            key: `${tt.chain}:${tt.address}`,
            value: {
              coingeckoId: t.coingeckoId,
              symbol: t.symbol,
              decimals: t.decimals,
            },
          })),
        )
        .map(({ key, value }) => [key, value]),
    )
  }

  async addFinancials(
    transfer: BridgeTransfer,
  ): Promise<BridgeTransferWithFinancials> {
    return {
      plugin: transfer.plugin,
      kind: transfer.kind,
      type: transfer.type,
      events: transfer.events,
      src: {
        ...transfer.src,
        financials: await this.getFinancials(transfer.src),
      },
      dst: {
        ...transfer.dst,
        financials: await this.getFinancials(transfer.dst),
      },
    }
  }

  private async getFinancials(side: TransferSideWithFinancials) {
    if (!side.tokenAddress) {
      return undefined
    }
    const token = this.tokensMap.get(
      `${side.event.ctx.chain}:${side.tokenAddress}`,
    )
    if (token && side.tokenAmount) {
      const amount = BigIntWithDecimals(
        BigInt(side.tokenAmount),
        token.decimals,
      )
      const timestamp = UnixTime.toStartOf(side.event.ctx.timestamp, 'hour')
      const price = await this.getPrice(token.coingeckoId, timestamp)
      const value = BigIntWithDecimals.multiply(
        amount,
        BigIntWithDecimals.fromNumber(price),
      )
      return {
        amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(6)),
        price: price,
        valueUsd: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
        symbol: token.symbol,
      }
    }
  }

  private async getPrice(
    coingeckoId: CoingeckoId,
    timestamp: UnixTime,
  ): Promise<number> {
    const cacheKey = this.getCacheKey(coingeckoId, timestamp)
    const cachedPrice = this.priceCache.get(cacheKey)
    if (cachedPrice) {
      return cachedPrice.value
    }

    const price = await this.priceProvider.getUsdPriceHistoryHourly(
      coingeckoId,
      timestamp,
      timestamp,
    )

    assert(
      price.length === 1,
      `${coingeckoId}: Failed to fetch price @ ${timestamp}`,
    )

    this.priceCache.set(cacheKey, {
      value: price[0].value,
      timestamp: Date.now(),
    })

    return price[0].value
  }

  private getCacheKey(
    coingeckoId: CoingeckoId,
    hourTimestamp: UnixTime,
  ): string {
    return `${coingeckoId}:${hourTimestamp}`
  }
}
