import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsAmount } from '../../kysely/generated/types'

export interface TvsAmountRecord {
  timestamp: UnixTime
  configurationId: string
  amount: bigint
}

export function toRecord(row: Selectable<TvsAmount>): TvsAmountRecord {
  return {
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
    amount: BigInt(row.amount),
  }
}

export function toRow(record: TvsAmountRecord): Insertable<TvsAmount> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
    amount: record.amount.toString(),
  }
}
