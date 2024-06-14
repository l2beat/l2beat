import { Insertable, Selectable } from 'kysely'
import { CurrentPrice as CurrentPriceEntity } from '../kysely/generated/types'

export interface CurrentPrice {
  coingeckoId: string
  priceUsd: number
  updatedAt: Date
}

export interface UpsertableCurrentPrice {
  coingeckoId: string
  priceUsd: number
}

export function fromEntity(
  entity: Selectable<CurrentPriceEntity>,
): CurrentPrice {
  return entity
}

export function toEntity(
  currentPrice: UpsertableCurrentPrice,
): Insertable<CurrentPriceEntity> {
  return {
    ...currentPrice,
    updatedAt: new Date(),
  }
}
