import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { L2CostPrice } from '../../kysely/generated/types'

export interface L2CostPriceRecord {
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(row: Selectable<L2CostPrice>): L2CostPriceRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: row.priceUsd,
  }
}

export function toRow(record: L2CostPriceRecord): Insertable<L2CostPrice> {
  return {
    timestamp: record.timestamp.toDate(),
    priceUsd: record.priceUsd,
  }
}
