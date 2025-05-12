import type { ImplementationChange } from '../../kysely/generated/types'

export const selectL2Cost = [
  'address',
  'type',
] as const satisfies (keyof ImplementationChange)[]
