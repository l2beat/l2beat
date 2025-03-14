import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsPrice } from '../../kysely/generated/types'

export interface TvsPriceRecord {
  priceId: string
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(row: Selectable<TvsPrice>): TvsPriceRecord {
  return {
    priceId: row.priceId,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.priceUsd,
  }
}

export function toRow(record: TvsPriceRecord): Insertable<TvsPrice> {
  return {
    priceId: record.priceId,
    timestamp: UnixTime.toDate(record.timestamp),
    priceUsd: record.priceUsd,
  }
}
