import { UnixTime } from '@l2beat/shared-pure'
import isNil from 'lodash/isNil'

export function fromTimestamp(timestamp: UnixTime | null | undefined) {
  return isNil(timestamp) ? timestamp : UnixTime.toDate(timestamp)
}

export function toTimestamp(timestamp: Date | null) {
  return isNil(timestamp) ? timestamp : UnixTime.fromDate(timestamp)
}
