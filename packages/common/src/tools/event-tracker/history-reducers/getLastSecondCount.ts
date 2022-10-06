import { UnixTime } from '@l2beat/types'

import { ReadonlyHistory } from '../types'

export function getLastSecondCount(
  history: ReadonlyHistory,
  now?: UnixTime,
): number {
  const _now = now ?? UnixTime.now()
  return history.get(_now.add(-1, 'seconds').toNumber()) ?? 0
}
