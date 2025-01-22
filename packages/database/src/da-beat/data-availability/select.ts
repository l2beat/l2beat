import type { DataAvailability } from '../../kysely/generated/types'

export const selectDataAvailability = [
  'projectId',
  'timestamp',
  'totalSize',
] as const satisfies (keyof DataAvailability)[]
