import { Logger } from '@l2beat/backend-tools'
import {
  assert,
  type CoingeckoId,
  getHourlyTimestamps,
  UnixTime,
} from '@l2beat/shared-pure'
import zip from 'lodash/zip'
import { CoingeckoClient } from '../../clients/coingecko/CoingeckoClient'
import type {
  CoinMarketChartRangeData,
  CoinsMarketResultData,
} from '../../clients/coingecko/types'

export const MAX_DAYS_FOR_HOURLY_PRECISION = 80
export const COINGECKO_INTERPOLATION_WINDOW_DAYS = 14

export interface QueryResultPoint {
  value: number
  timestamp: UnixTime
}

export class CoingeckoQueryService {
  static MAX_DAYS_FOR_ONE_CALL =
    MAX_DAYS_FOR_HOURLY_PRECISION - 2 * COINGECKO_INTERPOLATION_WINDOW_DAYS

  constructor(
    private readonly coingeckoClient: CoingeckoClient,
    private readonly logger = Logger.SILENT,
  ) {
    this.logger = logger.for(this)
  }

  async getUsdPriceHistoryHourly(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.queryHourlyPricesAndMarketCaps(coingeckoId, {
      from,
      to,
    })

    return queryResult.prices
  }

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.queryHourlyPricesAndMarketCaps(
      coingeckoId,
      range,
    )
    return zip(queryResult.prices, queryResult.marketCaps).map(
      ([price, marketCap]) => {
        assert(price && marketCap && price.timestamp === marketCap.timestamp)

        const value = approximateCirculatingSupply(marketCap.value, price.value)
        return {
          value,
          timestamp: price.timestamp,
        }
      },
    )
  }

  async queryHourlyPricesAndMarketCaps(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
  ) {
    const queryResult = await this.queryRawHourlyPricesAndMarketCaps(
      coingeckoId,
      range.from,
      range.to,
    )

    const timestamps = getHourlyTimestamps(range.from, range.to)

    const prices = pickClosestValues(queryResult.prices, timestamps)
    const marketCaps = pickClosestValues(queryResult.marketCaps, timestamps)

    this.assertCoingeckoApiResponse(
      coingeckoId,
      range,
      timestamps.length,
      prices,
      marketCaps,
    )

    return {
      prices,
      marketCaps,
    }
  }

  async queryRawHourlyPricesAndMarketCaps(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
  ): Promise<CoinMarketChartRangeData> {
    const [adjustedFrom, adjustedTo] = adjust(from, to)
    const results: CoinMarketChartRangeData[] = []

    let currentTo = adjustedTo

    while (true) {
      let currentFrom = currentTo - MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY
      if (adjustedFrom && currentFrom < adjustedFrom) {
        currentFrom = adjustedFrom
        const diff = currentTo - currentFrom
        if (diff < MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY) {
          currentTo = currentFrom + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY
        }
      }

      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        currentFrom,
        currentTo,
      )

      results.push(data)
      if (adjustedFrom && currentFrom === adjustedFrom) {
        break
      }

      currentTo = currentFrom
    }

    return combineResults(results)
  }

  assertCoingeckoApiResponse(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
    expectedLength: number,
    prices: QueryResultPoint[],
    marketCaps: QueryResultPoint[],
  ) {
    if (
      prices.length !== expectedLength ||
      marketCaps.length !== expectedLength
    ) {
      this.logger.warn('Insufficient data in response', {
        coingeckoId,
        from: range.from,
        to: range.to,
        expectedLength,
        prices: prices.length,
        marketCaps: marketCaps.length,
      })

      throw new Error(`Insufficient data in response for ${coingeckoId}`)
    }
  }

  static calculateAdjustedTo(from: UnixTime, to: UnixTime): UnixTime {
    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL

    return to > from + maxDaysForOneCall * UnixTime.DAY
      ? from + maxDaysForOneCall * UnixTime.DAY
      : to
  }

  async getLatestMarketData(coingeckoIds: CoingeckoId[]) {
    const prices: CoinsMarketResultData = []

    for (
      let i = 0;
      coingeckoIds.length > i * CoingeckoClient.COINS_MARKET_PAGE_SIZE;
      i++
    ) {
      const p = await this.coingeckoClient.getCoinsMarket(
        coingeckoIds.slice(
          i * CoingeckoClient.COINS_MARKET_PAGE_SIZE,
          (i + 1) * CoingeckoClient.COINS_MARKET_PAGE_SIZE,
        ),
        'usd',
      )
      prices.push(...p)
    }

    const result = new Map<
      CoingeckoId,
      { price: number; circulating: number }
    >()

    for (const c of coingeckoIds) {
      const p = prices.find((p) => p.id === c)
      if (p === undefined) {
        this.logger.error(`${c}: Price not found, assuming 0`)
        result.set(c, { price: 0, circulating: 0 })
      } else {
        result.set(c, {
          price: p.current_price,
          circulating: p.circulating_supply,
        })
      }
    }

    return result
  }
}

export function pickClosestValues(
  points: { value: number; date: Date }[],
  timestamps: UnixTime[],
): QueryResultPoint[] {
  //TODO: Handle this case properly
  if (points.length === 0) return []
  const result: QueryResultPoint[] = []

  const getDelta = (i: number, j: number) =>
    points[j].date.getTime() - timestamps[i] * 1000

  const nextIsCloser = (i: number, j: number) =>
    j + 1 < points.length &&
    Math.abs(getDelta(i, j)) >= Math.abs(getDelta(i, j + 1))

  let j = 0
  for (let i = 0; i < timestamps.length; i++) {
    while (nextIsCloser(i, j)) {
      j++
    }
    result.push({
      value: points[j].value,
      timestamp: timestamps[i],
    })
  }
  return result
}

function adjust(from: UnixTime, to: UnixTime): [UnixTime, UnixTime] {
  return [
    UnixTime.toEndOf(from, 'hour') -
      COINGECKO_INTERPOLATION_WINDOW_DAYS * UnixTime.DAY,
    UnixTime.toStartOf(to, 'hour') +
      COINGECKO_INTERPOLATION_WINDOW_DAYS * UnixTime.DAY,
  ]
}

export function generateRangesToCallHourly(from: UnixTime, to: UnixTime) {
  const ranges = []
  for (
    let start = from;
    start < to;
    start += MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY
  ) {
    const end = start + MAX_DAYS_FOR_HOURLY_PRECISION * UnixTime.DAY
    ranges.push({ start: start, end: end > to ? to : end })
  }
  return ranges
}

function combineResults(results: CoinMarketChartRangeData[]) {
  const data: CoinMarketChartRangeData = {
    prices: results.flatMap((result) => result.prices),
    marketCaps: results.flatMap((result) => result.marketCaps),
  }

  data.prices.sort((a, b) => a.date.getTime() - b.date.getTime())
  data.marketCaps.sort((a, b) => a.date.getTime() - b.date.getTime())

  return data
}

// This function is a neat helper to make circulating supply values more "round"
// Calculates the amount of digits in the number, and then "zeroes out" the last four of them
// e.g. 123456789 -> 123450000
export function approximateCirculatingSupply(marketCap: number, price: number) {
  const circulatingSupplyRaw = marketCap / price

  // reduce variation in the result by disregarding least significant parts
  const log = Math.floor(Math.log10(circulatingSupplyRaw))
  const digitsToClear = Math.max(log - 4, 0)
  const precision = 10 ** digitsToClear
  const value = Math.round(circulatingSupplyRaw / precision) * precision

  return value
}
