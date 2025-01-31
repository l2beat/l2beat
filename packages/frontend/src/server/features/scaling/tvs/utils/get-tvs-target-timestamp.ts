import { UnixTime } from '@l2beat/shared-pure'

export function getTvsTargetTimestamp() {
  return UnixTime.now().toStartOf('hour').add(-2, 'hours')
}
