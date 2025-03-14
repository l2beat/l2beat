import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsPrice } from '../../kysely/generated/types'

export interface TvsPriceRecord {
  configurationId: string
  timestamp: UnixTime
  priceUsd: number
  priceId: string
}

export function toRecord(row: Selectable<TvsPrice>): TvsPriceRecord {
  return {
    configurationId: row.configurationId,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.priceUsd,
    priceId: row.priceId,
  }
}

export function toRow(record: TvsPriceRecord): Insertable<TvsPrice> {
  return {
    configurationId: record.configurationId,
    timestamp: UnixTime.toDate(record.timestamp),
    priceUsd: record.priceUsd,
    priceId: record.priceId,
  }
}
