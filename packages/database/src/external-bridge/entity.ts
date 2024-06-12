import { Insertable, Selectable } from 'kysely'
import { ExternalBridgeType } from '../kysely/generated/enums'
import { ExternalBridge as ExternalBridgeEntity } from '../kysely/generated/types'

export interface ExternalBridge {
  id: string
  name: string
  type: ExternalBridgeType
  updatedAt: Date
  createdAt: Date
}

export function fromEntity(
  entity: Selectable<ExternalBridgeEntity>,
): ExternalBridge {
  return {
    id: entity.id,
    name: entity.name,
    type: entity.type,
    updatedAt: entity.updated_at,
    createdAt: entity.created_at,
  }
}

export function toEntity(
  externalBridge: ExternalBridge,
): Insertable<ExternalBridgeEntity> {
  return {
    id: externalBridge.id,
    name: externalBridge.name,
    type: externalBridge.type,
    updated_at: externalBridge.updatedAt,
    created_at: externalBridge.createdAt,
  }
}
