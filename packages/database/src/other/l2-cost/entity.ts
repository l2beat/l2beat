import type { TrackedTxId } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { L2Cost } from '../../kysely/generated/types'

export interface L2CostRecord {
  timestamp: UnixTime
  txHash: string
  configurationId: TrackedTxId
  gasUsed: number
  gasPrice: bigint
  calldataLength: number
  calldataGasUsed: number
  blobGasUsed: number | null
  blobGasPrice: bigint | null
}

export function toRecord(row: Selectable<L2Cost>): L2CostRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    gasPrice: BigInt(row.gasPrice),
    blobGasPrice: row.blobGasPrice ? BigInt(row.blobGasPrice) : null,
  }
}

export function toRow(record: L2CostRecord): Insertable<L2Cost> {
  return {
    ...record,
    timestamp: record.timestamp.toDate(),
    configurationId: record.configurationId.toString(),
    gasPrice: record.gasPrice.toString(),
    blobGasPrice: record.blobGasPrice?.toString() ?? null,
  }
}
