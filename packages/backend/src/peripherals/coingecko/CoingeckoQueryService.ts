import { CoingeckoClient, CoinMarketChartRangeData } from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  EthereumAddress,
  getHourlyTimestamps,
  UnixTime,
} from '@l2beat/shared-pure'
import { zip } from 'lodash'

export const MAX_DAYS_FOR_HOURLY_PRECISION = 80

export interface QueryResultPoint {
  value: number
  timestamp: UnixTime
  deltaMs: number
}

export class CoingeckoQueryService {
  constructor(private readonly coingeckoClient: CoingeckoClient) {}

  async getUsdPriceHistory(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const queryResult = await this.queryHourlyPricesAndMarketCaps(
      coingeckoId,
      { from, to },
      address,
    )
    return queryResult.prices
  }

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime | undefined; to: UnixTime },
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
    range: { from: UnixTime | undefined; to: UnixTime },
    address?: EthereumAddress,
  ) {
    const queryResult = await this.queryRawHourlyPricesAndMarketCaps(
      coingeckoId,
      range.from,
      range.to,
      address,
    )

    const from = range.from ?? UnixTime.fromDate(queryResult.prices[0].date)

    const timestamps = getHourlyTimestamps(from, range.to)

    return {
      prices: pickClosestValues(queryResult.prices, timestamps),
      marketCaps: pickClosestValues(queryResult.marketCaps, timestamps),
      totalVolumes: pickClosestValues(queryResult.totalVolumes, timestamps),
    }
  }

  async queryRawHourlyPricesAndMarketCaps(
    coingeckoId: CoingeckoId,
    from: UnixTime | undefined,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<CoinMarketChartRangeData> {
    const [adjustedFrom, adjustedTo] = adjust(from, to)
    const results: CoinMarketChartRangeData[] = []

    let currentTo = adjustedTo

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      let currentFrom = currentTo.add(-MAX_DAYS_FOR_HOURLY_PRECISION, 'days')
      if (adjustedFrom && currentFrom.lt(adjustedFrom)) {
        currentFrom = adjustedFrom
      }

      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        currentFrom,
        currentTo,
        address,
      )

      const noData = data.prices.length === 0 && data.marketCaps.length === 0
      if (noData) {
        assert(
          !adjustedFrom,
          `No data received for coin: ${coingeckoId.toString()}`,
        )
        break
      }

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

function adjust(
  from: UnixTime | undefined,
  to: UnixTime,
): [UnixTime | undefined, UnixTime] {
  const start = from && (from.isFull('hour') ? from : from.toNext('hour'))
  const end = to.isFull('hour') ? to : to.toStartOf('hour')
  return [start?.add(-12, 'hours'), end.add(12, 'hours')]
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
