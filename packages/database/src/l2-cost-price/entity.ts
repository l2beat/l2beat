import { UnixTime } from '@l2beat/shared-pure'
import { Insertable, Selectable } from 'kysely'
import { L2CostPrice as L2CostPriceRow } from '../kysely/generated/types'

export interface L2CostPrice {
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(row: Selectable<L2CostPriceRow>): L2CostPrice {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: row.price_usd,
  }
}

export function toRow(record: L2CostPrice): Insertable<L2CostPriceRow> {
  return {
    timestamp: record.timestamp.toDate(),
    price_usd: record.priceUsd,
  }
}
