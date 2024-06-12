import { Insertable, Selectable } from 'kysely'
import { BridgeEscrow as BridgeEscrowEntity } from '../kysely/generated/types'

export interface BridgeEscrow {
  id: string
  networkId: string
  address: string
  externalBridgeId?: string
  canonicalNetworkId?: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(
  entity: Selectable<BridgeEscrowEntity>,
): BridgeEscrow {
  return {
    id: entity.id,
    networkId: entity.network_id,
    address: entity.address,
    externalBridgeId: entity.external_bridge_id ?? undefined,
    canonicalNetworkId: entity.canonical_network_id ?? undefined,
    updatedAt: entity.created_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(
  bridgeEscrow: BridgeEscrow,
): Insertable<BridgeEscrowEntity> {
  return {
    id: bridgeEscrow.id,
    network_id: bridgeEscrow.networkId,
    address: bridgeEscrow.address,
    external_bridge_id: bridgeEscrow.externalBridgeId,
    canonical_network_id: bridgeEscrow.canonicalNetworkId,
    updated_at: bridgeEscrow.updatedAt,
    created_at: bridgeEscrow.createdAt,
  }
}
