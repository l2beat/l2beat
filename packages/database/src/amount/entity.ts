import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Amount } from '../kysely/generated/types'

export interface AmountRecord {
  timestamp: UnixTime
  amount: bigint
  configId: string
}

export function toRecord(entity: Selectable<Amount>): AmountRecord {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    amount: BigInt(entity.amount),
    configId: entity.configuration_id,
  }
}

export function toRow(amounts: AmountRecord): Insertable<Amount> {
  return {
    timestamp: amounts.timestamp.toDate(),
    amount: amounts.amount.toString(),
    configuration_id: amounts.configId,
  }
}
