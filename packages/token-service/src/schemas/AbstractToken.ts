import type {
  AbstractTokenRecord as DbAbstractTokenRecord,
  AbstractTokenUpdateable as DbAbstractTokenUpdateable,
} from '@l2beat/database'
import { v } from '@l2beat/validate'
import type { Equal, Expect } from '../utils/expectEqual'

type _ = Expect<Equal<AbstractTokenRecord, DbAbstractTokenRecord>>
export type AbstractTokenRecord = v.infer<typeof AbstractTokenRecord>
export const AbstractTokenRecord = v.object({
  symbol: v.string(),
  id: v.string(),
  issuer: v.union([v.string(), v.null()]),
  category: v.enum(['btc', 'ether', 'stablecoin', 'other']),
  iconUrl: v.union([v.string(), v.null()]),
  coingeckoId: v.union([v.string(), v.null()]),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]),
  comment: v.union([v.string(), v.null()]),
  reviewed: v.boolean(),
})

type __ = Expect<Equal<AbstractTokenUpdateable, DbAbstractTokenUpdateable>>
export type AbstractTokenUpdateable = v.infer<typeof AbstractTokenUpdateable>
export const AbstractTokenUpdateable = v.object({
  symbol: v.string().optional(),
  issuer: v.union([v.string(), v.null()]).optional(),
  category: v.enum(['btc', 'ether', 'stablecoin', 'other']).optional(),
  iconUrl: v.union([v.string(), v.null()]).optional(),
  coingeckoId: v.union([v.string(), v.null()]).optional(),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]).optional(),
  comment: v.union([v.string(), v.null()]).optional(),
  reviewed: v.boolean().optional(),
})
