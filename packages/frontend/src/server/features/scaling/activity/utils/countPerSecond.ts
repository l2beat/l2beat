import { UnixTime } from '@l2beat/shared-pure'

export function countPerSecond(count: number) {
  return count / UnixTime.DAY
}
