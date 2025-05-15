import type { FlatSources } from '../../kysely/generated/types'

export const selectFlatSources = [
  'projectId',
  'chainId',
  'blockNumber',
  'contentHash',
  'flat',
] as const satisfies (keyof FlatSources)[]
