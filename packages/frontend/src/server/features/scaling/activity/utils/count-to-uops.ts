import { UnixTime } from '@l2beat/shared-pure'

export function countToUops(count: number) {
  return count / UnixTime.DAY
}
