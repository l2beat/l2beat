import type { UnixTimePeriod } from '@l2beat/shared-pure'

export type Range = '7d' | '30d' | '90d' | '180d' | '1y' | 'max'

export type Resolution = Exclude<UnixTimePeriod, 'minute'>
