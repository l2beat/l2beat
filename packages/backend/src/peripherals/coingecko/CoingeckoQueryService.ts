import { CoingeckoClient, UnixTime } from '@l2beat/common'

type Granularity = 'daily' | 'hourly'

export interface PriceHistoryPoint {
  value: number
  timestamp: UnixTime
  timeDifference: number
}

export class CoingeckoQueryService {
  constructor(private coingeckoClient: CoingeckoClient) {}

  pickPrices(
    prices: { price: number; date: Date }[],
    timestamps: UnixTime[]
  ): PriceHistoryPoint[] {
    let index = 0

    const result: PriceHistoryPoint[] = []

    for (let i = 0; i < timestamps.length; i++) {
      //eslint-disable-next-line no-constant-condition
      while (true) {
        const delta = Math.abs(
          timestamps[i].toNumber() * 1000 - prices[index]?.date.getTime()
        )
        const nextDelta = Math.abs(
          timestamps[i].toNumber() * 1000 - prices[index + 1]?.date.getTime()
        )

        if (delta > nextDelta) index++
        else {
          result.push({
            value: prices[index].price,
            timestamp: timestamps[i],
            timeDifference: delta,
          })
          break
        }
      }
    }
    return result
  }
}

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400

export function getFullTimestampsList(
  from: UnixTime,
  to: UnixTime,
  granularity: Granularity
): UnixTime[] {
  if (from.gt(to)) throw new Error('FROM cannot be greater than TO')

  const period = granularity === 'hourly' ? 'hour' : 'day'
  from = from.isFull(period) ? from : from.toNext(period)
  to = to.isFull(period) ? to : to.toStartOf(period)

  const result: UnixTime[] = []
  const TIME_STEP = granularity === 'hourly' ? SECONDS_PER_HOUR : SECONDS_PER_DAY
  for (let i = from.toNumber(); i <= to.toNumber(); i += TIME_STEP) {
    result.push(new UnixTime(i))
  }
  return result
}
