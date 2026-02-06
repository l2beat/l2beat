import { UnixTime } from '@l2beat/shared-pure'
import { isNil } from 'es-toolkit/compat'

export function fromTimestamp(timestamp: UnixTime): Date
export function fromTimestamp(timestamp: null): null
export function fromTimestamp(timestamp: undefined): undefined
export function fromTimestamp(timestamp: UnixTime | undefined): Date | undefined
export function fromTimestamp(
  timestamp: UnixTime | null | undefined,
): Date | null | undefined
export function fromTimestamp(timestamp: UnixTime | null | undefined) {
  return isNil(timestamp) ? timestamp : UnixTime.toDate(timestamp)
}

export function toTimestamp(timestamp: Date): number
export function toTimestamp(timestamp: null): null
export function toTimestamp(timestamp: Date | null): number | null
export function toTimestamp(timestamp: Date | null) {
  return isNil(timestamp) ? timestamp : UnixTime.fromDate(timestamp)
}
