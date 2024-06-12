import { Insertable, Selectable } from 'kysely'
import { TokenBridge as TokenBridgeEntity } from '../kysely/generated/types'

export interface TokenBridge {
  id: string
  sourceTokenId: string
  targetTokenId: string
  externalBridgeId?: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<TokenBridgeEntity>): TokenBridge {
  return {
    id: entity.id,
    sourceTokenId: entity.source_token_id,
    targetTokenId: entity.target_token_id,
    externalBridgeId: entity.external_bridge_id ?? undefined,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(
  tokenBridge: TokenBridge,
): Insertable<TokenBridgeEntity> {
  return {
    id: tokenBridge.id,
    source_token_id: tokenBridge.sourceTokenId,
    target_token_id: tokenBridge.targetTokenId,
    external_bridge_id: tokenBridge.externalBridgeId,
    updated_at: tokenBridge.updatedAt,
    created_at: tokenBridge.createdAt,
  }
}
