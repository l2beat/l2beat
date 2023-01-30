import { CoingeckoClient, getTimestamps } from '@l2beat/common'
import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/types'

type Granularity = 'daily' | 'hourly'
interface Price {
  date: Date
  price: number
}

export interface PriceHistoryPoint {
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
    granularity: Granularity,
    address?: EthereumAddress,
  ): Promise<PriceHistoryPoint[]> {
    const [start, end] = adjustAndOffset(from, to, granularity)

    const prices = await this.queryPrices(
      coingeckoId,
      start,
      end,
      granularity,
      address,
    )

    const sortedPrices = prices.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )

    const timestamps = getTimestamps(from, to, granularity)

    return pickPrices(sortedPrices, timestamps)
  }

  async queryPrices(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity,
    address?: EthereumAddress,
  ): Promise<Price[]> {
    if (granularity === 'daily') {
      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coingeckoId,
        'usd',
        from,
        to,
        address,
      )
      return data.prices
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

      const prices: Price[] = []
      for (const result of results) {
        if (result.status === 'fulfilled') {
          prices.push(...result.value.prices)
        } else {
          throw result.reason
        }
      }

      return prices
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

export function pickPrices(
  prices: { price: number; date: Date }[],
  timestamps: UnixTime[],
): PriceHistoryPoint[] {
  //TODO: Handle this case properly
  if (prices.length === 0) return []
  const result: PriceHistoryPoint[] = []

  const getDelta = (i: number, j: number) =>
    prices[j].date.getTime() - timestamps[i].toNumber() * 1000

  const nextIsCloser = (i: number, j: number) =>
    j + 1 < prices.length &&
    Math.abs(getDelta(i, j)) >= Math.abs(getDelta(i, j + 1))

  let j = 0
  for (let i = 0; i < timestamps.length; i++) {
    while (nextIsCloser(i, j)) {
      j++
    }
    result.push({
      value: prices[j].price,
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
