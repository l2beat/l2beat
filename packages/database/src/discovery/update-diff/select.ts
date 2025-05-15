import type { UpdateDiff } from '../../kysely/generated/types'

export const selectUpdateDiff = [
  'address',
  'type',
] as const satisfies (keyof UpdateDiff)[]
