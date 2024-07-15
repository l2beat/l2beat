import { AggregatedLiveness as AggregatedLivenessRow } from '../kysely/generated/types'

export const selectAggregatedLiveness = [
  'project_id',
  'subtype',
  'range',
  'min',
  'avg',
  'max',
  'updated_at',
] as const satisfies (keyof AggregatedLivenessRow)[]
