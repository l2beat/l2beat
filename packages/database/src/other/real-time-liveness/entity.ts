import type { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { RealTimeLiveness } from '../../kysely/generated/types'

export interface RealTimeLivenessRecord {
  configurationId: TrackedTxId
  txHash: string
  timestamp: UnixTime
  blockNumber: number
}

export function toRecord(
  row: Selectable<RealTimeLiveness>,
): RealTimeLivenessRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(
  record: RealTimeLivenessRecord,
): Insertable<RealTimeLiveness> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}
