import { UnixTime } from '@l2beat/types'

import { ReadonlyHistory } from '../types'

export function getDurationAverage(
  history: ReadonlyHistory,
  from: UnixTime,
  to: UnixTime,
): number {
  let sum = 0

  history.forEach((count, timestamp) => {
    const when = new UnixTime(timestamp)
    if (when.gte(from) && when.lt(to)) {
      sum += count
    }
  })

  const total = to.toNumber() - from.toNumber()
  return total === 0 ? 0 : sum / total
}
