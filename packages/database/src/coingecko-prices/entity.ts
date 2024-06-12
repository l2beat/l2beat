import { Insertable, Selectable } from 'kysely'
import { CoingeckoPrice as CoingeckoPriceEntity } from '../kysely/generated/types'

export interface CoingeckoPrice {
  assetId: string
  priceUsd: number
  timestamp: Date
}

export function fromEntity(
  entity: Selectable<CoingeckoPriceEntity>,
): CoingeckoPrice {
  return {
    assetId: entity.asset_id,
    priceUsd: entity.price_usd,
    timestamp: entity.unix_timestamp,
  }
}

export function toEntity(
  stake: CoingeckoPrice,
): Insertable<CoingeckoPriceEntity> {
  return {
    asset_id: stake.assetId,
    price_usd: stake.priceUsd,
    unix_timestamp: stake.timestamp,
  }
}
