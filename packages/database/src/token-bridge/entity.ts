import { Insertable, Selectable } from 'kysely'
import { TokenBridge as TokenBridgeEntity } from '../kysely/generated/types'

export interface TokenBridge {
  id: string
  sourceTokenId: string
  targetTokenId: string
  externalBridgeId: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<TokenBridgeEntity>): TokenBridge {
  return row
}

export function toRow(record: TokenBridge): Insertable<TokenBridgeEntity> {
  return record
}
