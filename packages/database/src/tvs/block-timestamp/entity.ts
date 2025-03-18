import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsBlockTimestamp } from '../../kysely/generated/types'

export interface TvsBlockTimestampRecord {
  timestamp: UnixTime
  configurationId: string
  chain: string
  blockNumber: number
}

export function toRecord(
  row: Selectable<TvsBlockTimestamp>,
): TvsBlockTimestampRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: TvsBlockTimestampRecord,
): Insertable<TvsBlockTimestamp> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}
