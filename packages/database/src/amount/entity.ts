import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Amount as AmountRow } from '../kysely/generated/types'

export interface Amount {
  timestamp: UnixTime
  amount: bigint
  configId: string
}

export function toRecord(entity: Selectable<AmountRow>): Amount {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    amount: BigInt(entity.amount),
    configId: entity.configuration_id,
  }
}

export function toRow(amounts: Amount): Insertable<AmountRow> {
  return {
    timestamp: amounts.timestamp.toDate(),
    amount: amounts.amount.toString(),
    configuration_id: amounts.configId,
  }
}
