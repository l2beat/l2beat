import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Price } from '../../kysely/generated/types'

export interface PriceRecord {
  configId: string
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(row: Selectable<Price>): PriceRecord {
  return {
    configId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.price_usd,
  }
}

export function toRow(record: PriceRecord): Insertable<Price> {
  return {
    configuration_id: record.configId,
    timestamp: record.timestamp.toDate(),
    price_usd: record.priceUsd,
  }
}
