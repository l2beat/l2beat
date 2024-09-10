import { Insertable, Selectable } from 'kysely'
import { ExternalBridge } from '../../kysely/generated/types'
import { ExternalBridgeType } from '../../kysely/generated/enums'

export interface ExternalBridgeRecord {
  id: string
  name: string
  type: ExternalBridgeType
  updatedAt: Date
  createdAt: Date
}

export function toRecord(
  row: Selectable<ExternalBridge>,
): ExternalBridgeRecord {
  return row
}

export function toRow(
  record: ExternalBridgeRecord,
): Insertable<ExternalBridge> {
  return record
}
