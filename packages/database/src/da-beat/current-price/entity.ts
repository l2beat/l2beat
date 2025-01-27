import type { Insertable, Selectable } from 'kysely'
import type { CurrentPrice } from '../../kysely/generated/types'

export interface CurrentPriceRecord {
  coingeckoId: string
  priceUsd: number
  updatedAt: Date
}

export function toRecord(entity: Selectable<CurrentPrice>): CurrentPriceRecord {
  return entity
}

export function toRow(
  currentPrice: Omit<CurrentPriceRecord, 'updatedAt'>,
): Insertable<CurrentPrice> {
  return {
    ...currentPrice,
    updatedAt: new Date(),
  }
}
