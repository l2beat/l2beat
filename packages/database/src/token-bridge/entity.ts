import { Insertable, Selectable } from 'kysely'
import { TokenBridge } from '../kysely/generated/types'

export interface TokenBridgeRecord {
  id: string
  sourceTokenId: string
  targetTokenId: string
  externalBridgeId: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<TokenBridge>): TokenBridgeRecord {
  return row
}

export function toRow(record: TokenBridgeRecord): Insertable<TokenBridge> {
  return record
}
