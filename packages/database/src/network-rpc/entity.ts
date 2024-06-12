import { Insertable, Selectable } from 'kysely'
import { NetworkRpc as NetworkRpcEntity } from '../kysely/generated/types'

export interface NetworkRpc {
  id: string
  networkId: string
  url: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(entity: Selectable<NetworkRpcEntity>): NetworkRpc {
  return {
    id: entity.id,
    networkId: entity.network_id,
    url: entity.url,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(networkRpc: NetworkRpc): Insertable<NetworkRpcEntity> {
  return {
    id: networkRpc.id,
    network_id: networkRpc.networkId,
    url: networkRpc.url,
    updated_at: networkRpc.updatedAt,
    created_at: networkRpc.createdAt,
  }
}
