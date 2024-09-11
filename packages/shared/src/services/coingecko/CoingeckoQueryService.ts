import {
  assert,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
  getHourlyTimestamps,
} from '@l2beat/shared-pure'
import { zip } from 'lodash'

import { Logger } from '@l2beat/backend-tools'
import { CoingeckoClient } from './CoingeckoClient'
import { CoinMarketChartRangeData } from './model'

export const MAX_DAYS_FOR_HOURLY_PRECISION = 80
const SECONDS_IN_DAY = 24 * 60 * 60
export const COINGECKO_INTERPOLATION_WINDOW_DAYS = 14

export interface QueryResultPoint {
  value: number
  timestamp: UnixTime
  deltaMs: number
}

export class CoingeckoQueryService {
  static MAX_DAYS_FOR_ONE_CALL =
    MAX_DAYS_FOR_HOURLY_PRECISION - 2 * COINGECKO_INTERPOLATION_WINDOW_DAYS

  constructor(
    private readonly coingeckoClient: CoingeckoClient,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async getUsdPriceHistoryHourly(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.queryHourlyPricesAndMarketCaps(
      coingeckoId,
      { from, to },
      // TODO: either make it multichain or remove this fallback
      address,
    )

    return queryResult.prices
  }

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.queryHourlyPricesAndMarketCaps(
      coingeckoId,
      range,
      address,
    )
    return zip(queryResult.prices, queryResult.marketCaps).map(
      ([price, marketCap]) => {
        assert(price && marketCap && price.timestamp === marketCap.timestamp)

        const value = approximateCirculatingSupply(marketCap.value, price.value)
        return {
          value,
          timestamp: price.timestamp,
          deltaMs: price.deltaMs,
        }
      },
    )
  }

  async queryHourlyPricesAndMarketCaps(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
    address?: EthereumAddress,
  ) {
    const queryResult = await this.queryRawHourlyPricesAndMarketCaps(
      coingeckoId,
      range.from,
      range.to,
      address,
    )

    const timestamps = getHourlyTimestamps(range.from, range.to)

    const prices = pickClosestValues(queryResult.prices, timestamps)
    const marketCaps = pickClosestValues(queryResult.marketCaps, timestamps)
    const totalVolumes = pickClosestValues(queryResult.totalVolumes, timestamps)

    this.assertCoingeckoApiResponse(
      coingeckoId,
      range,
      timestamps.length,
      prices,
      marketCaps,
      totalVolumes,
    )

    return {
      prices,
      marketCaps,
      totalVolumes,
    }
  }

  async queryRawHourlyPricesAndMarketCaps(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<CoinMarketChartRangeData> {
    const [adjustedFrom, adjustedTo] = adjust(from, to)
    const results: CoinMarketChartRangeData[] = []

    let currentTo = adjustedTo

    while (true) {
      let currentFrom = currentTo.add(-MAX_DAYS_FOR_HOURLY_PRECISION, 'days')
      if (adjustedFrom && currentFrom.lt(adjustedFrom)) {
        currentFrom = adjustedFrom
        const diff = currentTo.toNumber() - currentFrom.toNumber()
        if (diff < MAX_DAYS_FOR_HOURLY_PRECISION * SECONDS_IN_DAY) {
          currentTo = new UnixTime(
            currentFrom.toNumber() +
              MAX_DAYS_FOR_HOURLY_PRECISION * SECONDS_IN_DAY,
          )
        }
      }

      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        currentFrom,
        currentTo,
        address,
      )

      results.push(data)
      if (adjustedFrom && currentFrom.equals(adjustedFrom)) {
        break
      }

      currentTo = currentFrom
    }

    return combineResults(results)
  }

  async getCoinIds(): Promise<Map<EthereumAddress, CoingeckoId>> {
    const coinsList = await this.coingeckoClient.getCoinList({
      includePlatform: true,
    })

    const result = new Map()

    coinsList.map((coin) => {
      if (coin.platforms.ethereum)
        result.set(EthereumAddress(coin.platforms.ethereum), coin.id)
    })

    return result
  }

  assertCoingeckoApiResponse(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
    expectedLength: number,
    prices: QueryResultPoint[],
    marketCaps: QueryResultPoint[],
    totalVolumes: QueryResultPoint[],
  ) {
    if (
      prices.length !== expectedLength ||
      marketCaps.length !== expectedLength ||
      totalVolumes.length !== expectedLength
    ) {
      this.logger.warn('Issue with Coingecko API response', {
        coingeckoId,
        from: range.from.toNumber(),
        to: range.to.toNumber(),
        expectedLength,
        prices: prices.length,
        marketCaps: marketCaps.length,
        totalVolumes: totalVolumes.length,
      })

      throw new Error(`Issue with Coingecko API for ${coingeckoId}`)
    }
  }

  static getAdjustedTo(from: UnixTime, to: UnixTime): UnixTime {
    const maxDaysForOneCall = CoingeckoQueryService.MAX_DAYS_FOR_ONE_CALL

    return to.gt(from.add(maxDaysForOneCall, 'days'))
      ? from.add(maxDaysForOneCall, 'days')
      : to
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
    points[j].date.getTime() - timestamps[i].toNumber() * 1000

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
      deltaMs: getDelta(i, j),
    })
  }
  return result
}

function adjust(from: UnixTime, to: UnixTime): [UnixTime, UnixTime] {
  return [
    from.toEndOf('hour').add(-COINGECKO_INTERPOLATION_WINDOW_DAYS, 'days'),
    to.toStartOf('hour').add(COINGECKO_INTERPOLATION_WINDOW_DAYS, 'days'),
  ]
}

export function generateRangesToCallHourly(from: UnixTime, to: UnixTime) {
  const ranges = []
  for (
    let start = from;
    start.lt(to);
    start = start.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days')
  ) {
    const end = start.add(MAX_DAYS_FOR_HOURLY_PRECISION, 'days')
    ranges.push({ start: start, end: end.gt(to) ? to : end })
  }
  return ranges
}

function combineResults(results: CoinMarketChartRangeData[]) {
  const data: CoinMarketChartRangeData = {
    prices: results.flatMap((result) => result.prices),
    marketCaps: results.flatMap((result) => result.marketCaps),
    totalVolumes: results.flatMap((result) => result.totalVolumes),
  }

  data.prices.sort((a, b) => a.date.getTime() - b.date.getTime())
  data.marketCaps.sort((a, b) => a.date.getTime() - b.date.getTime())
  data.totalVolumes.sort((a, b) => a.date.getTime() - b.date.getTime())

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
