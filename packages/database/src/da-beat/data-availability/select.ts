import type { DataAvailability } from '../../kysely/generated/types'

export const selectDataAvailability = [
  'timestamp',
  'daLayer',
  'projectId',
  'configurationId',
  'totalSize',
] as const satisfies (keyof DataAvailability)[]
