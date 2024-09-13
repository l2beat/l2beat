import { DiscoveryCache } from '../../kysely/generated/types'

export const selectDiscoveryCache = [
  'key',
  'value',
  'chain',
  'blockNumber',
] as const satisfies (keyof DiscoveryCache)[]
