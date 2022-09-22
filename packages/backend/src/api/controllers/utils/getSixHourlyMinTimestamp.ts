import { UnixTime } from '@l2beat/types'

export function getSixHourlyMinTimestamp(now?: UnixTime) {
  return (now ?? UnixTime.now()).add(-90, 'days')
}
