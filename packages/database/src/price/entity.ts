import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { Price as PriceRow } from '../kysely/generated/types'

export interface Price {
  configId: string
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(row: Selectable<PriceRow>): Price {
  return {
    configId: row.configuration_id,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.price_usd,
  }
}

export function toRow(record: Price): Insertable<PriceRow> {
  return {
    configuration_id: record.configId,
    timestamp: record.timestamp.toDate(),
    price_usd: record.priceUsd,
  }
}
