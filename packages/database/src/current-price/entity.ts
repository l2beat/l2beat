import { Insertable, Selectable } from 'kysely'
import { CurrentPrice as CurrentPriceEntity } from '../kysely/generated/types'

export interface CurrentPrice {
  assetId: string
  priceUsd: number
  updatedAt: Date
}

export function fromEntity(
  entity: Selectable<CurrentPriceEntity>,
): CurrentPrice {
  return entity
}

export function toEntity(
  currentPrice: CurrentPrice,
): Insertable<CurrentPriceEntity> {
  return currentPrice
}
