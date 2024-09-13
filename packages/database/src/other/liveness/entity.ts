import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Liveness } from '../../kysely/generated/types'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  configurationId: TrackedTxId
}

export function toRecord(row: Selectable<Liveness>): LivenessRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: LivenessRecord): Insertable<Liveness> {
  return {
    ...record,
    timestamp: record.timestamp.toDate(),
  }
}
