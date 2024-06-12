import { Insertable, Selectable } from 'kysely'
import { TokenMeta as TokenMetaEntity } from '../kysely/generated/types'

export interface TokenMeta {
  id: string
  tokenId: string
  externalId?: string
  source: string
  name?: string
  symbol?: string
  decimals?: number
  logoUrl?: string
  contractName?: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<TokenMetaEntity>): TokenMeta {
  return {
    id: entity.id,
    tokenId: entity.token_id,
    externalId: entity.external_id ?? undefined,
    source: entity.source,
    name: entity.name ?? undefined,
    symbol: entity.symbol ?? undefined,
    decimals: entity.decimals ?? undefined,
    logoUrl: entity.logo_url ?? undefined,
    contractName: entity.contract_name ?? undefined,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(tokenMeta: TokenMeta): Insertable<TokenMetaEntity> {
  return {
    id: tokenMeta.id,
    token_id: tokenMeta.tokenId,
    external_id: tokenMeta.externalId,
    source: tokenMeta.source,
    name: tokenMeta.name,
    symbol: tokenMeta.symbol,
    decimals: tokenMeta.decimals,
    logo_url: tokenMeta.logoUrl,
    contract_name: tokenMeta.contractName,
    updated_at: tokenMeta.updatedAt,
    created_at: tokenMeta.createdAt,
  }
}
