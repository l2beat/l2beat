import { CoingeckoId, Logger, SimpleDate, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { BigNumber, utils } from 'ethers'

import {
  CoingeckoQueryService,
  PriceHistoryPoint,
} from '../../../peripherals/coingecko/CoingeckoQueryService'
import { AsyncCache } from '../AsyncCache'
import { PriceSnapshot } from './model'

export class PriceService {
  constructor(
    private asyncCache: AsyncCache,
    private coingeckoQueryService: CoingeckoQueryService,
    private logger: Logger
  ) {}

  async getPrices(
    tokens: TokenInfo[],
    dates: SimpleDate[]
  ): Promise<Map<SimpleDate, PriceSnapshot>> {
    const priceHistory = new Map<number, PriceSnapshot>()

    await Promise.all(
      tokens.map(async (token) => {
        const prices = await this.getTokenPrices(token, dates)

        for (const { timestamp, value } of prices) {
          const priceSnapshot = priceHistory.get(timestamp.toNumber()) ?? {
            token: {},
            eth: BigNumber.from(0),
          }
          if (!token.address) {
            priceSnapshot.eth = utils.parseUnits(value.toFixed(18), 18)
          } else {
            priceSnapshot.token[token.address] = utils.parseUnits(
              value.toFixed(18 * 2 - token.decimals),
              18 * 2 - token.decimals
            )
          }
          priceHistory.set(timestamp.toNumber(), priceSnapshot)
        }

        this.logger.info('Fetched prices', { token: token.coingeckoId })
      })
    )

    const entries: [SimpleDate, PriceSnapshot][] = []
    for (const date of dates) {
      const priceSnapshot = priceHistory.get(date.toUnixTimestamp())
      if (!priceSnapshot) {
        throw new Error(`No prices for ${date}`)
      } else {
        entries.push([date, priceSnapshot])
      }
    }

    return new Map(entries)
  }

  private async getTokenPrices(token: TokenInfo, dates: SimpleDate[]) {
    const result: { value: number; timestamp: UnixTime }[] = []

    let earliestUnknownDate = undefined
    for (const date of dates) {
      const cachedPrice = await this.getCachedPrice(token, date)
      if (cachedPrice === undefined) {
        earliestUnknownDate = date
        this.logger.debug('Cache miss', {
          token: token.coingeckoId,
          date: earliestUnknownDate.toString(),
        })
        break
      } else {
        result.push({
          value: cachedPrice,
          timestamp: new UnixTime(date.toUnixTimestamp()),
        })
      }
    }

    if (earliestUnknownDate !== undefined) {
      const end = dates[dates.length - 1]
      const coingeckoPrices =
        await this.coingeckoQueryService.getUsdPriceHistory(
          CoingeckoId(token.coingeckoId),
          new UnixTime(earliestUnknownDate.toUnixTimestamp()),
          new UnixTime(end.toUnixTimestamp()),
          'daily'
        )
      result.push(...coingeckoPrices)
      this.logger.info('Fetched prices', {
        token: token.coingeckoId,
        pricePoints: coingeckoPrices.length,
      })

      for (const price of coingeckoPrices) {
        this.setCachedPrice(token, price)
      }
    }

    return result
  }

  private getCachedPrice(token: TokenInfo, date: SimpleDate) {
    return this.asyncCache.get(getCacheKey(token, date), (x: number) => x)
  }

  private setCachedPrice(token: TokenInfo, price: PriceHistoryPoint) {
    this.asyncCache.set(
      getCacheKey(token, price.timestamp),
      price.value,
      (x) => x
    )
  }
}

function getCacheKey(token: TokenInfo, date: SimpleDate | UnixTime) {
  if (date instanceof UnixTime) {
    date = SimpleDate.fromUnixTimestamp(date.toNumber())
  }
  return `price-${token.coingeckoId}-${date}`
}
