import type { AnomalyStats } from '../../kysely/generated/types'

export const selectAnomaly = [
  'timestamp',
  'projectId',
  'subtype',
  'mean',
  'stdDev',
] as const satisfies (keyof AnomalyStats)[]
