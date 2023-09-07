import { CoingeckoClient, CoinMarketChartRangeData } from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  EthereumAddress,
  getTimestamps,
  UnixTime,
} from '@l2beat/shared-pure'

type Granularity = 'daily' | 'hourly'

export interface QueryResultPoint {
  value: number
  timestamp: UnixTime
  deltaMs: number
}

// TODO: add cache to avoid querying the same data multiple times
// because right now some tokens will have the same CoingeckoId
export class CoingeckoQueryService {
  constructor(private readonly coingeckoClient: CoingeckoClient) {}

  async getUsdPriceHistory(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity,
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const [start, end] = adjustAndOffset(from, to, granularity)

    const prices = (
      await this.queryCoinMarketChartRange(
        coingeckoId,
        start,
        end,
        granularity,
        address,
      )
    ).prices

    const sortedPrices = prices.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )

    const timestamps = getTimestamps(from, to, granularity)

    return pickPoints(sortedPrices, timestamps)
  }

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity,
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    const [start, end] = adjustAndOffset(from, to, granularity)
    const timestamps = getTimestamps(from, to, granularity)

    const queryResult = await this.queryCoinMarketChartRange(
      coingeckoId,
      start,
      end,
      granularity,
      address,
    )

    const sortedPrices = queryResult.prices.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )
    const sortedMarketCaps = queryResult.marketCaps.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )

    const pickedPrices = pickPoints(sortedPrices, timestamps)
    const pickedMarketCaps = pickPoints(sortedMarketCaps, timestamps)

    const result: QueryResultPoint[] = []

    for (let i = 0; i < timestamps.length; i++) {
      const price = pickedPrices[i].value
      const marketCap = pickedMarketCaps[i].value

      const value = approximateCirculatingSupply(marketCap, price)

      result.push({
        value,
        timestamp: timestamps[i],
        deltaMs: pickedPrices[i].deltaMs,
      })
    }

    return result
  }

  async queryCoinMarketChartRange(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity,
    address?: EthereumAddress,
  ): Promise<CoinMarketChartRangeData> {
    if (granularity === 'daily') {
      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        from,
        to,
        address,
      )
      assert(
        data.prices.length > 0,
        `Can't get data from Coingecko for ${coingeckoId.toString()} from ${from.toNumber()} to ${to.toNumber()}`,
      )
      return data
    } else {
      const results = await Promise.allSettled(
        generateRangesToCallHourly(from, to).map((range) =>
          this.coingeckoClient.getCoinMarketChartRange(
            coingeckoId,
            'usd',
            range.start,
            range.end,
            address,
          ),
        ),
      )

      const marketChartRangeData: CoinMarketChartRangeData = {
        prices: [],
        marketCaps: [],
        totalVolumes: [],
      }
      for (const result of results) {
        if (result.status === 'fulfilled') {
          assert(
            result.value.prices.length > 0,
            `Can't get data from Coingecko for ${coingeckoId.toString()} from ${from.toNumber()} to ${to.toNumber()} (one of batches)`,
          )

          marketChartRangeData.prices.push(...result.value.prices)
          marketChartRangeData.marketCaps.push(...result.value.marketCaps)
          marketChartRangeData.totalVolumes.push(...result.value.totalVolumes)
        } else {
          throw result.reason
        }
      }

      return marketChartRangeData
    }
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

export function pickPoints(
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

function adjust(from: UnixTime, to: UnixTime, granularity: Granularity) {
  const period = granularity === 'hourly' ? 'hour' : 'day'
  return [
    from.isFull(period) ? from : from.toNext(period),
    to.isFull(period) ? to : to.toStartOf(period),
  ]
}

function adjustAndOffset(
  from: UnixTime,
  to: UnixTime,
  granularity: Granularity,
) {
  const [start, end] = adjust(from, to, granularity)
  if (granularity === 'hourly') {
    return [start.add(-30, 'minutes'), end.add(30, 'minutes')]
  } else {
    return [start.add(-12, 'hours'), end.add(12, 'hours')]
  }
}

export const COINGECKO_HOURLY_MAX_SPAN_IN_DAYS = 80

export function generateRangesToCallHourly(from: UnixTime, to: UnixTime) {
  const ranges = []
  for (
    let start = from;
    start.lt(to);
    start = start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days')
  ) {
    const end = start.add(COINGECKO_HOURLY_MAX_SPAN_IN_DAYS, 'days')
    ranges.push({ start: start, end: end.gt(to) ? to : end })
  }
  return ranges
}

// This function is a neat helper to make circulating supply values more "round"
// Calculates the amount of digits in the number, and then "zeroes out" the last four of them
// e.g. 123456789 -> 123450000
export function approximateCirculatingSupply(marketCap: number, price: number) {
  const circulatingSupplyRaw = marketCap / price
  assert(
    circulatingSupplyRaw >= 1,
    'Circulating supply cannot be less than one',
  )

  // reduce variation in the result by disregarding least significant parts
  const log = Math.floor(Math.log10(circulatingSupplyRaw))
  const digitsToClear = Math.max(log - 4, 0)
  const precision = 10 ** digitsToClear
  const value = Math.round(circulatingSupplyRaw / precision) * precision

  return value
}
