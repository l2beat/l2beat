import type { AggregatedLiveness } from '../../kysely/generated/types'

export const selectAggregatedLiveness = [
  'timestamp',
  'projectId',
  'subtype',
  'min',
  'avg',
  'max',
  'numberOfRecords',
] as const satisfies (keyof AggregatedLiveness)[]
