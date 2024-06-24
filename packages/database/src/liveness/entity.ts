import { TrackedTxId } from '@l2beat/shared'
import {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Liveness as LivenessRow } from '../kysely/generated/types'

export interface Liveness {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  trackedTxId: TrackedTxId
}

export interface LivenessRecordWithProjectIdAndSubtype {
  timestamp: UnixTime
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
}

export interface LivenessRecordWithSubtype {
  timestamp: UnixTime
  subtype: TrackedTxsConfigSubtype
}

export interface LivenessTransactionsRecordWithSubtype {
  timestamp: UnixTime
  txHash: string
  subtype: TrackedTxsConfigSubtype
}

export interface LivenessRowWithProjectIdAndSubtype {
  timestamp: Date
  project_id: string
  subtype: string
}

export interface LivenessTransactionRowWithAndSubtype {
  timestamp: Date
  subtype: string
  tx_hash: string
}

export function toRecord(row: Selectable<LivenessRow>): Liveness {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    trackedTxId: TrackedTxId.unsafe(row.tracked_tx_id),
  }
}

export function toRecordWithTimestampAndSubtype(
  row: LivenessRowWithProjectIdAndSubtype,
): Omit<LivenessRecordWithProjectIdAndSubtype, 'projectId'> {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: TrackedTxsConfigSubtype.parse(row.subtype),
  }
}

export function toTransactionRecordWithTimestamp(
  row: LivenessTransactionRowWithAndSubtype,
): LivenessTransactionsRecordWithSubtype {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    subtype: TrackedTxsConfigSubtype.parse(row.subtype),
    txHash: row.tx_hash,
  }
}

export function toRow(record: Liveness): Insertable<LivenessRow> {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    tracked_tx_id: record.trackedTxId.toString(),
  }
}
