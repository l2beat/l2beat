import type { DataAvailability2 } from '../../kysely/generated/types'

export const selectDataAvailability2 = [
  'timestamp',
  'daLayer',
  'projectId',
  'configurationId',
  'totalSize',
] as const satisfies (keyof DataAvailability2)[]
