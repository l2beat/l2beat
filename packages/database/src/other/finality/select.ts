import type { Finality } from '../../kysely/generated/types'

export const selectFinality = [
  'averageStateUpdate',
  'averageTimeToInclusion',
  'maximumTimeToInclusion',
  'minimumTimeToInclusion',
  'projectId',
  'timestamp',
] as const satisfies (keyof Finality)[]
