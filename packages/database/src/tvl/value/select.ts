import type { Value } from '../../kysely/generated/types'

export const selectValue = [
  'projectId',
  'timestamp',
  'dataSource',
  'external',
  'externalAssociated',
  'externalForTotal',
  'externalAssociatedForTotal',
  'canonical',
  'canonicalAssociated',
  'canonicalForTotal',
  'canonicalAssociatedForTotal',
  'native',
  'nativeAssociated',
  'nativeForTotal',
  'nativeAssociatedForTotal',
  'ether',
  'stablecoin',
] as const satisfies (keyof Value)[]

export const selectValueWithPrefix = <T extends string>(prefix: T) =>
  selectValue.map((s) => `${prefix}.${s}` as const)
