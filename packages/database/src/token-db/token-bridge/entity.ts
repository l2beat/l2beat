import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { TokenBridge } from '../../kysely/generated/types'

export interface TokenBridgeRecord {
  id: string
  sourceTokenId: string
  targetTokenId: string
  externalBridgeId: string | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableTokenBridgeRecord = Omit<
  TokenBridgeRecord,
  'id' | 'createdAt' | 'updatedAt'
>

export function upsertableToRecord(
  record: UpsertableTokenBridgeRecord,
): Insertable<TokenBridge> {
  return {
    ...record,
    id: nanoid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
