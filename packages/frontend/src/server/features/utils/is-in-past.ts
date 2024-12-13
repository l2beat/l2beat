import { UnixTime } from '@l2beat/shared-pure'

export function isInPast(dateInSeconds: number) {
  return dateInSeconds < UnixTime.now().toNumber()
}
