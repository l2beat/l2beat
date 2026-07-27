import type {
  AbstractTokenRecord as DbAbstractTokenRecord,
  AbstractTokenUpdateable as DbAbstractTokenUpdateable,
} from '@l2beat/database'
import { TOKEN_CATEGORIES } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { Equal, Expect } from '../utils/expectEqual'

export const CoingeckoEntry = v.object({
  coingeckoId: v.string(),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]),
  iconUrl: v.union([v.string(), v.null()]),
})

export type CoingeckoEntry = v.infer<typeof CoingeckoEntry>

type _ = Expect<Equal<AbstractTokenRecord, DbAbstractTokenRecord>>
export type AbstractTokenRecord = v.infer<typeof AbstractTokenRecord>
export const AbstractTokenRecord = v.object({
  symbol: v.string(),
  id: v.string(),
  issuer: v.union([v.string(), v.null()]),
  category: v.union([v.enum(TOKEN_CATEGORIES), v.null()]),
  iconUrl: v.union([v.string(), v.null()]),
  coingeckoId: v.union([v.string(), v.null()]),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]),
  additionalCoingeckoEntries: v
    .union([v.array(CoingeckoEntry), v.null(), v.undefined()])
    .transform((value) => value ?? null),
  comment: v.union([v.string(), v.null()]),
  reviewed: v.boolean(),
  isPriceUnreliable: v.boolean(),
})

type __ = Expect<Equal<AbstractTokenUpdateable, DbAbstractTokenUpdateable>>
export type AbstractTokenUpdateable = v.infer<typeof AbstractTokenUpdateable>
export const AbstractTokenUpdateable = v.object({
  symbol: v.string().optional(),
  issuer: v.union([v.string(), v.null()]).optional(),
  category: v.union([v.enum(TOKEN_CATEGORIES), v.null()]).optional(),
  iconUrl: v.union([v.string(), v.null()]).optional(),
  coingeckoId: v.union([v.string(), v.null()]).optional(),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]).optional(),
  additionalCoingeckoEntries: v
    .union([v.array(CoingeckoEntry), v.null()])
    .optional(),
  comment: v.union([v.string(), v.null()]).optional(),
  reviewed: v.boolean().optional(),
  isPriceUnreliable: v.boolean().optional(),
})
