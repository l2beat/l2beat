import { Insertable, Selectable } from 'kysely'
import { BridgeEscrow as BridgeEscrowEntity } from '../kysely/generated/types'

export interface BridgeEscrow {
  id: string
  networkId: string
  address: string
  externalBridgeId: string | null
  canonicalNetworkId: string | null
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<BridgeEscrowEntity>): BridgeEscrow {
  return row
}

export function toRow(record: BridgeEscrow): Insertable<BridgeEscrowEntity> {
  return record
}
