import { Insertable, Selectable } from 'kysely'
import { CurrentPrice } from '../kysely/generated/types'

export interface CurrentPriceRecord {
  coingeckoId: string
  priceUsd: number
  updatedAt: Date
}

export interface UpsertableCurrentPrice {
  coingeckoId: string
  priceUsd: number
}

export function toRecord(entity: Selectable<CurrentPrice>): CurrentPriceRecord {
  return entity
}

export function toRow(
  currentPrice: UpsertableCurrentPrice,
): Insertable<CurrentPrice> {
  return {
    ...currentPrice,
    updatedAt: new Date(),
  }
}
