import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { TvsPrice } from '../../kysely/generated/types'

export interface TvsPriceRecord {
  timestamp: UnixTime
  configurationId: string
  priceId: string
  priceUsd: number
}

export function toRecord(row: Selectable<TvsPrice>): TvsPriceRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    configurationId: row.configurationId,
    priceId: row.priceId,
    priceUsd: +row.priceUsd,
  }
}

export function toRow(record: TvsPriceRecord): Insertable<TvsPrice> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    configurationId: record.configurationId,
    priceId: record.priceId,
    priceUsd: record.priceUsd,
  }
}
