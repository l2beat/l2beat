import { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Liveness } from '../kysely/generated/types'

export interface LivenessRecord {
  timestamp: UnixTime
  blockNumber: number
  txHash: string
  configurationId: TrackedTxId
}

export function toRecord(row: Selectable<Liveness>): LivenessRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    blockNumber: row.block_number,
    txHash: row.tx_hash,
    configurationId: row.configuration_id,
  }
}

export function toRow(record: LivenessRecord): Insertable<Liveness> {
  return {
    timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    tx_hash: record.txHash,
    configuration_id: record.configurationId.toString(),
  }
}
