import { CoingeckoId, Logger, SimpleDate, UnixTime } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { BigNumber, utils } from 'ethers'

import {
  CoingeckoQueryService,
  PriceHistoryPoint,
} from '../../../peripherals/coingecko/CoingeckoQueryService'
import { AsyncCache } from '../AsyncCache'
import { FetchedPrices } from './model'

export class PriceService {
  constructor(
    private asyncCache: AsyncCache,
    private coingeckoQueryService: CoingeckoQueryService,
    private logger: Logger
  ) {}

  async getPrices(
    tokens: TokenInfo[],
    dates: SimpleDate[]
  ): Promise<Map<SimpleDate, FetchedPrices>> {
    const fetchedPrices = new Map<number, FetchedPrices>()

    await Promise.all(
      tokens.map(async (token) => {
        const prices: PriceHistoryPoint[] = await this.handleCache(token, dates)

        for (const { timestamp, value } of prices) {
          const fetchedPricesForDate = fetchedPrices.get(
            timestamp.toNumber()
          ) ?? {
            token: {},
            eth: BigNumber.from(0),
          }
          if (!token.address) {
            fetchedPricesForDate.eth = utils.parseUnits(value.toFixed(18), 18)
          } else {
            fetchedPricesForDate.token[token.address] = utils.parseUnits(
              value.toFixed(18 * 2 - token.decimals),
              18 * 2 - token.decimals
            )
          }
          fetchedPrices.set(timestamp.toNumber(), fetchedPricesForDate)
        }

        this.logger.info('Fetched prices', { token: token.coingeckoId })
      })
    )

    const entries: [SimpleDate, FetchedPrices][] = []
    for (const date of dates) {
      const fetchedPricesForDate = fetchedPrices.get(date.toUnixTimestamp())
      if (!fetchedPricesForDate) {
        throw new Error(`No prices for ${date.toString()}`)
      } else {
        entries.push([date, fetchedPricesForDate])
      }
    }

    return new Map(entries)
  }

  private async handleCache(
    token: TokenInfo,
    dates: SimpleDate[]
  ): Promise<PriceHistoryPoint[]> {
    const end = dates[dates.length - 1]

    const prices: PriceHistoryPoint[] = []
    let earliestUnknownDate = undefined

    for (let i = 0; i < dates.length; i++) {
      const cachedPrice = await this.getCachedPrice(token, dates[i])
      if (!cachedPrice) {
        earliestUnknownDate = dates[i]
        this.logger.info('Cache miss', {
          token: token.coingeckoId,
          date: earliestUnknownDate.toString(),
        })
        break
      } else {
        prices.push(cachedPrice)
      }
    }

    if (earliestUnknownDate !== undefined) {
      const coingeckoPrices =
        await this.coingeckoQueryService.getUsdPriceHistory(
          CoingeckoId(token.coingeckoId),
          new UnixTime(earliestUnknownDate.toUnixTimestamp()),
          new UnixTime(end.toUnixTimestamp()),
          'daily'
        )
      prices.push(...coingeckoPrices)

      if (coingeckoPrices)
        this.logger.info('Coingecko API call', {
          token: token.coingeckoId,
          amountOfPricesFetched: coingeckoPrices.length,
        })

      coingeckoPrices?.map((price) => {
        this.setCachedPrice(token, price)
      })
    }

    return prices
  }

  private getCachedPrice(token: TokenInfo, date: SimpleDate) {
    type CachePriceHistoryPoint = {
      value: number
      timestamp: number
      deltaMs: number
    }
    return this.asyncCache.get(
      getCacheKey(token, date),
      (x: CachePriceHistoryPoint) => ({
        value: x.value,
        timestamp: new UnixTime(x.timestamp),
        deltaMs: x.deltaMs,
      })
    )
  }

  private setCachedPrice(token: TokenInfo, price: PriceHistoryPoint) {
    const date = SimpleDate.fromUnixTimestamp(price.timestamp.toNumber())
    this.asyncCache.set(
      `price-${token.coingeckoId}-${date.toString()}`,
      price,
      (x: PriceHistoryPoint) => x
    )
  }
}

const getCacheKey = (token: TokenInfo, date: SimpleDate) => {
  return `price-${token.coingeckoId}-${date.toString()}`
}
