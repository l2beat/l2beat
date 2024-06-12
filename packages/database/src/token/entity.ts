import { Insertable, Selectable } from 'kysely'
import { Token as TokenEntity } from '../kysely/generated/types'

export interface Token {
  id: string
  networkId: string
  address: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<TokenEntity>): Token {
  return {
    id: entity.id,
    networkId: entity.network_id,
    address: entity.address,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(token: Token): Insertable<TokenEntity> {
  return {
    id: token.id,
    network_id: token.networkId,
    address: token.address,
    updated_at: token.updatedAt,
    created_at: token.createdAt,
  }
}
