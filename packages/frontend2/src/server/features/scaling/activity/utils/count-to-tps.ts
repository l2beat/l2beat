import { UnixTime } from '@l2beat/shared-pure'

export function countToTps(count: number) {
  return count / UnixTime.DAY
}
