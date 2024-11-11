import { EntityRecord } from './entity'

export const selectEntity = [
  'id',
  'name',
  'createdAt',
  'updatedAt',
] as const satisfies (keyof EntityRecord)[]
