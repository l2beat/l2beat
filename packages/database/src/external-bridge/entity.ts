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

export function toRecord(
  row: Selectable<ExternalBridgeEntity>,
): ExternalBridge {
  return row
}

export function toRow(
  record: ExternalBridge,
): Insertable<ExternalBridgeEntity> {
  return record
}
