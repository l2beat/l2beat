import { Insertable, Selectable } from 'kysely'
import { ExplorerType } from '../kysely/generated/enums'
import { NetworkExplorer as NetworkExplorerEntity } from '../kysely/generated/types'

export interface NetworkExplorer {
  id: string
  networkId: string
  type: ExplorerType
  url: string
  apiKey: string
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(
  entity: Selectable<NetworkExplorerEntity>,
): NetworkExplorer {
  return {
    id: entity.id,
    networkId: entity.network_id,
    type: entity.type,
    url: entity.url,
    apiKey: entity.api_key,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(
  networkExplorer: NetworkExplorer,
): Insertable<NetworkExplorerEntity> {
  return {
    id: networkExplorer.id,
    network_id: networkExplorer.networkId,
    type: networkExplorer.type,
    url: networkExplorer.url,
    api_key: networkExplorer.apiKey,
    updated_at: networkExplorer.updatedAt,
    created_at: networkExplorer.createdAt,
  }
}
