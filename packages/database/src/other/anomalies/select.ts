import type { Anomaly } from '../../kysely/generated/types'

export const selectAnomaly = [
  'timestamp',
  'projectId',
  'subtype',
  'duration',
] as const satisfies (keyof Anomaly)[]
