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
    ...row,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: TvsPriceRecord): Insertable<TvsPrice> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}
