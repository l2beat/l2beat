import type { FlatSources } from '../../kysely/generated/types'

export const selectFlatSources = [
  'projectName',
  'chainId',
  'blockNumber',
  'contentHash',
  'flat',
] as const satisfies (keyof FlatSources)[]
