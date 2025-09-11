import type { PriceProvider } from '@l2beat/shared'
import { assert, CoingeckoId, UnixTime } from '@l2beat/shared-pure'
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
    let outbound: TransferSideWithFinancials = transfer.outbound
    let inbound: TransferSideWithFinancials = transfer.inbound

    if (transfer.outbound.token) {
      const token = this.tokensMap.get(
        `${transfer.outbound.event.ctx.chain}:${transfer.outbound.token.address}`,
      )
      if (token) {
        const amount = BigIntWithDecimals(
          BigInt(transfer.outbound.token.amount),
          token.decimals,
        )

        const timestamp = UnixTime.toStartOf(
          transfer.outbound.event.ctx.timestamp,
          'hour',
        )
        const price = await this.getPrice(token.coingeckoId, timestamp)

        const value = BigIntWithDecimals.multiply(
          amount,
          BigIntWithDecimals.fromNumber(price),
        )

        outbound = {
          ...outbound,
          financials: {
            amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(6)),
            price: price,
            valueUsd: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
            symbol: token.symbol,
          },
        }
      }
    }

    if (transfer.inbound.token) {
      const token = this.tokensMap.get(
        `${transfer.inbound.event.ctx.chain}:${transfer.inbound.token.address}`,
      )
      if (token) {
        const amount = BigIntWithDecimals(
          BigInt(transfer.inbound.token.amount),
          token.decimals,
        )

        const timestamp = UnixTime.toStartOf(
          transfer.inbound.event.ctx.timestamp,
          'hour',
        )
        const price = await this.getPrice(
          CoingeckoId(token.coingeckoId),
          timestamp,
        )

        const value = BigIntWithDecimals.multiply(
          amount,
          BigIntWithDecimals.fromNumber(price),
        )

        inbound = {
          ...inbound,
          financials: {
            amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(6)),
            price: price,
            valueUsd: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
            symbol: token.symbol,
          },
        }
      }
    }

    return {
      type: transfer.type,
      events: transfer.events,
      outbound,
      inbound,
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
