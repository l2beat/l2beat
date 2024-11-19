import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { Entity } from '../../kysely/generated/types'

export interface EntityRecord {
  id: string
  name: string
  updatedAt: Date
  createdAt: Date
}

export type UpsertableEntityRecord = Omit<
  EntityRecord,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRow(
  record: UpsertableEntityRecord,
): Insertable<Entity> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
