import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import type { Price } from '../../kysely/generated/types'

export interface PriceRecord {
  configId: string
  timestamp: UnixTime
  priceUsd: number
}

export function toRecord(row: Selectable<Price>): PriceRecord {
  return {
    configId: row.configurationId,
    timestamp: UnixTime.fromDate(row.timestamp),
    priceUsd: +row.priceUsd,
  }
}

export function toRow(record: PriceRecord): Insertable<Price> {
  return {
    configurationId: record.configId,
    timestamp: record.timestamp.toDate(),
    priceUsd: record.priceUsd,
  }
}
