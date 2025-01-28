import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { Amount } from '../../kysely/generated/types'

export interface AmountRecord {
  timestamp: UnixTime
  amount: bigint
  configId: string
}

export function toRecord(entity: Selectable<Amount>): AmountRecord {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    amount: BigInt(entity.amount),
    configId: entity.configurationId,
  }
}

export function toRow(amounts: AmountRecord): Insertable<Amount> {
  return {
    timestamp: amounts.timestamp.toDate(),
    amount: amounts.amount.toString(),
    configurationId: amounts.configId,
  }
}
