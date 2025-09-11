import type { PriceProvider } from '@l2beat/shared'
import { assert, CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { BigIntWithDecimals } from '../../tvs/tools/bigIntWithDecimals'
import type {
  BridgeTransfer,
  BridgeTransferWithFinancials,
  TransferSideWithFinancials,
} from '../plugins/types'
import type { InteropToken } from './tokens'

export class FinancialsService {
  tokensMap: Map<
    string,
    {
      coingeckoId: CoingeckoId
      symbol: string
      decimals: number
    }
  >

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

        const price = await this.priceProvider.getUsdPriceHistoryHourly(
          token.coingeckoId,
          UnixTime.toStartOf(transfer.outbound.event.ctx.timestamp, 'hour'),
          UnixTime.toStartOf(transfer.outbound.event.ctx.timestamp, 'hour'),
        )

        assert(
          price.length === 1,
          `${token.coingeckoId}: Failed to fetch price @ ${UnixTime.toStartOf(transfer.outbound.event.ctx.timestamp, 'hour')}`,
        )

        const value = BigIntWithDecimals.multiply(
          amount,
          BigIntWithDecimals.fromNumber(price[0].value),
        )

        outbound = {
          ...outbound,
          financials: {
            amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(2)),
            price: price[0].value,
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

        const price = await this.priceProvider.getUsdPriceHistoryHourly(
          CoingeckoId(token.coingeckoId),
          UnixTime.toStartOf(transfer.inbound.event.ctx.timestamp, 'hour'),
          UnixTime.toStartOf(transfer.inbound.event.ctx.timestamp, 'hour'),
        )

        assert(
          price.length === 1,
          `${token.coingeckoId}: Failed to fetch price @ ${UnixTime.toStartOf(transfer.outbound.event.ctx.timestamp, 'hour')}`,
        )

        const value = BigIntWithDecimals.multiply(
          amount,
          BigIntWithDecimals.fromNumber(price[0].value),
        )

        inbound = {
          ...inbound,
          financials: {
            amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(2)),
            price: price[0].value,
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
}
