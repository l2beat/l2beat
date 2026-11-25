import { v } from '@l2beat/validate'

const nullableNumber = v.union([v.number(), v.null()])

export const TvsResultItemSchema = v
  .object({
    timestamp: v.number(),
    totalTvs: nullableNumber,
    bySource: v.object({
      native: nullableNumber,
      canonical: nullableNumber,
      external: nullableNumber,
    }),
    byCategory: v.object({
      stablecoins: nullableNumber,
      eth: nullableNumber,
      btc: nullableNumber,
      other: nullableNumber,
      publicRwa: nullableNumber,
      restrictedRwa: nullableNumber,
    }),
    ethPrice: nullableNumber,
  })
  .describe('TvsChartDataPoint')

export type TvsResultItem = v.infer<typeof TvsResultItemSchema>
export const TvsResultSchema = v.array(TvsResultItemSchema)

export const TokenTvsResultItemSchema = v
  .object({
    timestamp: v.number(),
    valueUsd: nullableNumber,
    amount: nullableNumber,
  })
  .describe('TokenTvsChartDataPoint')
export type TokenTvsResultItem = v.infer<typeof TokenTvsResultItemSchema>
export const TokenTvsResultSchema = v.array(TokenTvsResultItemSchema)

export const TvsRangeSchema = v.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
export type TvsRange = v.infer<typeof TvsRangeSchema>

export interface TokenExclusions {
  excludeAssociatedTokens: boolean
  excludeRwaRestrictedTokens: boolean
}

const BooleanQuerySchema = v.enum(['true', 'false'])

export const TvsQuerySchema = v.object({
  range: TvsRangeSchema.optional(),
  excludeAssociatedTokens: BooleanQuerySchema.optional(),
  excludeRwaRestrictedTokens: BooleanQuerySchema.optional(),
})
