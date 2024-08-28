import { Insertable, Selectable } from 'kysely'
import { BridgeEscrow } from '../../kysely/token-db/types'

export interface BridgeEscrowRecord {
  id: string
  networkId: string
  address: string
  externalBridgeId: string | null
  canonicalNetworkId: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<BridgeEscrow>): BridgeEscrowRecord {
  return row
}

export function toRow(record: BridgeEscrowRecord): Insertable<BridgeEscrow> {
  return record
}
