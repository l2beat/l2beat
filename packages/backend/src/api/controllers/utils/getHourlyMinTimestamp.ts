import { UnixTime } from '@l2beat/types'

export function getHourlyMinTimestamp(now?: UnixTime) {
  return (now ?? UnixTime.now()).add(-7, 'days')
}
