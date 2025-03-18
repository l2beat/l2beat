import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsAmount } from '../../kysely/generated/types'

export interface TvsAmountRecord {
  timestamp: UnixTime
  configurationId: string
  project: string
  amount: bigint
}

export function toRecord(entity: Selectable<TvsAmount>): TvsAmountRecord {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    configurationId: entity.configurationId,
    project: entity.project,
    amount: BigInt(entity.amount),
  }
}

export function toRow(amount: TvsAmountRecord): Insertable<TvsAmount> {
  return {
    timestamp: UnixTime.toDate(amount.timestamp),
    configurationId: amount.configurationId,
    project: amount.project,
    amount: amount.amount.toString(),
  }
}
