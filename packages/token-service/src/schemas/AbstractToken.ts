import { v } from '@l2beat/validate'

export type AbstractTokenRecordSchema = v.infer<
  typeof AbstractTokenRecordSchema
>
export const AbstractTokenRecordSchema = v.object({
  symbol: v.string(),
  id: v.string(),
  issuer: v.union([v.string(), v.null()]),
  category: v.string(),
  iconUrl: v.union([v.string(), v.null()]),
  coingeckoId: v.union([v.string(), v.null()]),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]),
  comment: v.union([v.string(), v.null()]),
  reviewed: v.boolean(),
})

export type AbstractTokenUpdateableSchema = v.infer<
  typeof AbstractTokenUpdateableSchema
>
export const AbstractTokenUpdateableSchema = v.object({
  symbol: v.string().optional(),
  issuer: v.union([v.string(), v.null()]).optional(),
  category: v.string().optional(),
  iconUrl: v.union([v.string(), v.null()]).optional(),
  coingeckoId: v.union([v.string(), v.null()]).optional(),
  coingeckoListingTimestamp: v.union([v.number(), v.null()]).optional(),
  comment: v.union([v.string(), v.null()]).optional(),
  reviewed: v.boolean().optional(),
})
