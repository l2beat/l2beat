import { AggregatedLiveness as AggregatedLivenessRow } from '../kysely/generated/types'

export const selectAggregatedLiveness = [
  'project_id',
  'subtype',
  'range',
  'min',
  'avg',
  'max',
  'timestamp',
] as const satisfies (keyof AggregatedLivenessRow)[]
