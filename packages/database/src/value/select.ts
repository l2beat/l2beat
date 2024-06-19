import { Value as ValueRow } from '../kysely/generated/types'

export const selectValue = [
  'project_id',
  'timestamp',
  'data_source',
  'external',
  'external_for_total',
  'canonical',
  'canonical_for_total',
  'native',
  'native_for_total',
] as const satisfies (keyof ValueRow)[]
