import { CoingeckoClient, CoingeckoId, UnixTime } from '@l2beat/common'

type Granularity = 'daily' | 'hourly'

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
    const data = await this.coingeckoClient.getCoinMarketChartRange(
      coindId,
      'usd',
      start,
      end
    )

    const prices = data.prices.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )

    const timestamps = getFullTimestampsList(from, to, granularity)

    return pickPrices(prices, timestamps)
  }
}

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400

export function pickPrices(
  prices: { price: number; date: Date }[],
  timestamps: UnixTime[]
): PriceHistoryPoint[] {
  const result: PriceHistoryPoint[] = []

  const getDelta = (i: number, j: number) =>
    prices[j].date.getTime() - timestamps[i].toNumber() * 1000

  const nextIsCloser = (i: number, j: number) =>
    j + 1 < prices.length &&
    Math.abs(getDelta(i, j)) > Math.abs(getDelta(i, j + 1))

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
    return [start.add(-12, 'hours'), end.add(12, 'hours')]
  }
}
