import { Value } from '../../kysely/generated/types'

export const selectValue = [
  'project_id',
  'timestamp',
  'data_source',
  'external',
  'external_associated',
  'external_for_total',
  'external_associated_for_total',
  'canonical',
  'canonical_associated',
  'canonical_for_total',
  'canonical_associated_for_total',
  'native',
  'native_associated',
  'native_for_total',
  'native_associated_for_total',
] as const satisfies (keyof Value)[]
