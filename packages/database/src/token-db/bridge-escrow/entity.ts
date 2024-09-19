import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { BridgeEscrow } from '../../kysely/generated/types'

export interface BridgeEscrowRecord {
  id: string
  networkId: string
  address: string
  externalBridgeId: string | null
  canonicalNetworkId: string | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableBridgeEscrowRecord = Omit<
  Insertable<BridgeEscrow>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRecord(
  record: UpsertableBridgeEscrowRecord,
): Insertable<BridgeEscrow> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
