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

export function getFullTimestampsList(
  from: UnixTime,
  to: UnixTime,
  granularity: Granularity
): UnixTime[] {
  if (from.gt(to)) throw new Error('FROM cannot be greater than TO')

  if (granularity === 'hourly') {
    from = from.isFull('hour') ? from : from.toStartOf('hour')
    to = to.isFull('hour') ? to : to.toNext('hour')

    const result: UnixTime[] = []

    const SECONDS_PER_HOUR = 3600
    for (let i = from.toNumber(); i <= to.toNumber(); i += SECONDS_PER_HOUR) {
      result.push(new UnixTime(i))
    }

    return result
  } else if (granularity === 'daily') {
    from = from.isFull('day') ? from : from.toStartOf('day')
    to = to.isFull('day') ? to : to.toNext('day')

    const result: UnixTime[] = []

    const SECONDS_PER_DAY = 86400
    for (let i = from.toNumber(); i <= to.toNumber(); i += SECONDS_PER_DAY) {
      result.push(new UnixTime(i))
    }

    return result
  }

  throw new Error('Granularity was not specified')
}
