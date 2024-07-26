import { Value } from '../../kysely/generated/types'

export const selectValue = [
  'id',
  'projectId',
  'dataSource',
  'timestamp',
  'type',
  'forTotal',
  'native',
  'canonical',
  'external',
] as const satisfies (keyof Value)[]
