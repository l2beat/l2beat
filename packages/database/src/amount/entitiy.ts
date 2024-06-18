import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Amount as AmountRow } from '../kysely/generated/types'

export interface Amounts {
  timestamp: UnixTime
  amount: bigint
  configurationId: string
}

export function toRecord(entity: Selectable<AmountRow>): Amounts {
  return {
    timestamp: UnixTime.fromDate(entity.timestamp),
    amount: BigInt(entity.amount),
    configurationId: entity.configuration_id,
  }
}

export function toRow(amounts: Amounts): Insertable<AmountRow> {
  return {
    timestamp: amounts.timestamp.toDate(),
    amount: amounts.amount.toString(),
    configuration_id: amounts.configurationId,
  }
}
