import { Da } from '../kysely/generated/types'

export const selectDa = [
  'project',
  'timestamp',
  'totalSize',
] as const satisfies (keyof Da)[]
