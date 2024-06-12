import { Insertable, Selectable } from 'kysely'
import { Cache as CacheEntity } from '../kysely/generated/types'

export interface Cache {
  key: string
  value: string
  chainId: number
  blockNumber?: number
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<CacheEntity>): Cache {
  return {
    key: entity.key,
    value: entity.value,
    chainId: entity.chain_id,
    blockNumber: entity.block_number ?? undefined,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(cache: Cache): Insertable<CacheEntity> {
  return {
    key: cache.key,
    value: cache.value,
    chain_id: cache.chainId,
    block_number: cache.blockNumber,
    updated_at: cache.updatedAt,
    created_at: cache.createdAt,
  }
}
