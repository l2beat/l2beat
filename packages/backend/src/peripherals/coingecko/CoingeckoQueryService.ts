import {
  CoingeckoClient,
  CoingeckoId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/common'

type Granularity = 'daily' | 'hourly'
type Price = { date: Date; price: number }

export interface PriceHistoryPoint {
  value: number
  timestamp: UnixTime
  deltaMs: number
}

export class CoingeckoQueryService {
  constructor(private coingeckoClient: CoingeckoClient) {}

  async getUsdPriceHistory(
    coindId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity
  ): Promise<PriceHistoryPoint[]> {
    const [start, end] = adjustAndOffset(from, to, granularity)

    const prices = await this.queryPrices(coindId, start, end, granularity)

    const sortedPrices = prices.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )

    const timestamps = getFullTimestampsList(from, to, granularity)

    return pickPrices(sortedPrices, timestamps)
  }

  async queryPrices(
    coindId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    granularity: Granularity
  ): Promise<Price[]> {
    if (granularity === 'daily') {
      const data = await this.coingeckoClient.getCoinMarketChartRange(
        coindId,
        'usd',
        from,
        to
      )
      return data.prices
    } else {
      const ranges = await Promise.all(
        generateRangesToCallHourly(from, to).map((range) =>
          this.coingeckoClient.getCoinMarketChartRange(
            coindId,
            'usd',
            range.start,
            range.end
          )
        )
      )

      return ranges.map((x) => x.prices).flat()
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

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400

export function pickPrices(
  prices: { price: number; date: Date }[],
  timestamps: UnixTime[]
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

export function getFullTimestampsList(
  from: UnixTime,
  to: UnixTime,
  granularity: Granularity
): UnixTime[] {
  if (from.gt(to)) throw new Error('FROM cannot be greater than TO')

  const [start, end] = adjust(from, to, granularity)

  const result: UnixTime[] = []
  const TIME_STEP =
    granularity === 'hourly' ? SECONDS_PER_HOUR : SECONDS_PER_DAY
  for (let i = start.toNumber(); i <= end.toNumber(); i += TIME_STEP) {
    result.push(new UnixTime(i))
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
  granularity: Granularity
) {
  const [start, end] = adjust(from, to, granularity)
  if (granularity === 'hourly') {
    return [start.add(-30, 'minutes'), end.add(30, 'minutes')]
  } else {
    // make sure that we have enough data to fill in missing prices
    return [start.add(-7, 'days'), end.add(12, 'hours')]
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
