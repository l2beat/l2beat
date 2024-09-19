import { Insertable } from 'kysely'
import { ExternalBridgeType } from '../../kysely/generated/enums'
import { ExternalBridge } from '../../kysely/generated/types'
import { nanoid } from 'nanoid'

export interface ExternalBridgeRecord {
  id: string
  name: string
  type: ExternalBridgeType
  updatedAt: Date
  createdAt: Date
}

export type UpsertableExternalBridgeRecord = Omit<
  ExternalBridgeRecord,
  'id' | 'createdAt' | 'updatedAt'
>

export function upsertableToRecord(
  record: UpsertableExternalBridgeRecord,
): Insertable<ExternalBridge> {
  return {
    ...record,
    id: nanoid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
