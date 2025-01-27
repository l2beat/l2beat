import type { AggregatedLiveness } from '../../kysely/generated/types'

export const selectAggregatedLiveness = [
  'projectId',
  'subtype',
  'range',
  'min',
  'avg',
  'max',
  'updatedAt',
] as const satisfies (keyof AggregatedLiveness)[]
