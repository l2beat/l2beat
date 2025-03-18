import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsAmount } from '../../kysely/generated/types'

export interface TvsAmountRecord {
  timestamp: UnixTime
  amount: bigint
  configurationId: string
  project: string
}

export function toRecord(entity: Selectable<TvsAmount>): TvsAmountRecord {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    amount: BigInt(entity.amount),
    configurationId: entity.configurationId,
    project: entity.project,
  }
}

export function toRow(amount: TvsAmountRecord): Insertable<TvsAmount> {
  return {
    timestamp: UnixTime.toDate(amount.timestamp),
    amount: amount.amount.toString(),
    configurationId: amount.configurationId,
    project: amount.project,
  }
}
