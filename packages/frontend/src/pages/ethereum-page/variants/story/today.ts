import type { TodaySoFar } from '../../live/types'
import { BLOB_BYTES, DAY_SECONDS, SLOT_SECONDS } from './facts'

/** Today's partial day, as the charts' last, hollow point */
export interface TodayPoint {
  /** Where on the time axis the day has got to */
  t: number
  hoursIn: number
  blobBytesPerSecond: number
  tps: number
  burnedEth: number
  issuedEth: number
}

export function toTodayPoint(
  today: TodaySoFar | undefined,
): TodayPoint | undefined {
  if (!today || today.slots === 0) return undefined
  const seconds = Math.min(today.slots * SLOT_SECONDS, DAY_SECONDS)
  return {
    t: today.startedAt + seconds,
    hoursIn: Math.floor(seconds / 3600),
    blobBytesPerSecond: (today.blobs * BLOB_BYTES) / seconds,
    tps: today.txs / seconds,
    burnedEth: today.burnedEth,
    issuedEth: today.issuedEth,
  }
}
