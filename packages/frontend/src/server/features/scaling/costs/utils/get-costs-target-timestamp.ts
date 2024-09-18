import { UnixTime } from '@l2beat/shared-pure'

export function getCostsTargetTimestamp() {
  return UnixTime.now().toStartOf('hour').add(-1, 'hours')
}
