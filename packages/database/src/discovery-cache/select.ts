import { DiscoveryCache } from '../kysely/generated/types'

export const selectDiscoveryCache = [
  'key',
  'value',
  'chain',
  'block_number',
] as const satisfies (keyof DiscoveryCache)[]
