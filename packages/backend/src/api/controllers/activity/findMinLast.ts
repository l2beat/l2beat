import { UnixTime } from '@l2beat/shared-pure'

import { DailyTransactionCount } from './types'

export function findMinLast(
  layer2sCounts: DailyTransactionCount[][],
): UnixTime | undefined {
  const lasts = layer2sCounts
    .map((counts) => counts.at(-1)?.timestamp.toNumber())
    .filter((t): t is number => t !== undefined)
  return lasts.length > 0 ? new UnixTime(Math.min(...lasts)) : undefined
}
