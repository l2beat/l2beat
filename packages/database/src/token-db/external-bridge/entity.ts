import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { ExternalBridgeType } from '../../kysely/generated/enums'
import { ExternalBridge } from '../../kysely/generated/types'

export interface ExternalBridgeRecord {
  id: string
  name: string
  managedBy: string | null
  type: ExternalBridgeType | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableExternalBridgeRecord = Omit<
  ExternalBridgeRecord,
  'id' | 'createdAt' | 'updatedAt' | 'managedBy'
> & { managedBy?: string | null }

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
