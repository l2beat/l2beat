import type { DiscoveryCache } from '../../kysely/generated/types'

export const selectDiscoveryCache = [
  'key',
  'value',
] as const satisfies (keyof DiscoveryCache)[]
