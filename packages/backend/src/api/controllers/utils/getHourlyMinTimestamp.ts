import { UnixTime } from '@l2beat/common'

export function getHourlyMinTimestamp(now?: UnixTime) {
  return (now ?? UnixTime.now()).add(-7, 'days')
}
