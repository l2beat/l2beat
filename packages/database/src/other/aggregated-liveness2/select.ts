import type { AggregatedLiveness2 } from '../../kysely/generated/types'

export const selectAggregatedLiveness2 = [
  'timestamp',
  'projectId',
  'subtype',
  'min',
  'avg',
  'max',
] as const satisfies (keyof AggregatedLiveness2)[]
