import { UnixTime } from '@l2beat/shared-pure'

export function getHourlyMinTimestamp(now?: UnixTime) {
  return (now ?? UnixTime.now()).add(-7, 'days')
}
