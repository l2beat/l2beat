import { v } from '@l2beat/validate'

export const ScalingRiskSchema = v
  .object({
    name: v.string(),
    value: v.string(),
    sentiment: v
      .enum(['bad', 'warning', 'good', 'neutral', 'UnderReview'])
      .optional(),
    description: v.string().optional(),
    warning: v
      .object({
        value: v.string(),
        sentiment: v.enum(['bad', 'warning', 'neutral']),
      })
      .optional(),
    regular: v
      .object({
        value: v.string(),
        sentiment: v
          .enum(['bad', 'warning', 'good', 'neutral', 'UnderReview'])
          .optional(),
      })
      .optional()
      .describe(
        'Exit Window only: the window for regular upgrades, when `value` is the one for emergency upgrades.',
      ),
  })
  .describe('ScalingRisk')
export type ScalingRisk = v.infer<typeof ScalingRiskSchema>

export const ScalingSummaryTvsSchema = v
  .object({
    timestamp: v.number(),
    breakdown: v.object({
      total: v.number(),
      ether: v.number(),
      stablecoin: v.number(),
      associated: v.number(),
    }),
    change7d: v.union([v.number(), v.null()]),
  })
  .describe('ScalingSummaryTvs')
export type ScalingSummaryTvs = v.infer<typeof ScalingSummaryTvsSchema>

export const ScalingSummaryProjectSchema = v
  .object({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    shortName: v.string().optional(),
    layer: v.enum(['layer2', 'layer3']),
    type: v.string().optional(),
    hostChain: v.string(),
    stacks: v.array(v.string()),
    purposes: v.array(v.string()),
    badges: v.array(v.string()),
    stage: v.string(),
    isUnderReview: v.boolean(),
    risks: v.array(ScalingRiskSchema),
    tvs: v.union([ScalingSummaryTvsSchema, v.null()]),
    associatedTokens: v.array(
      v.object({ symbol: v.string(), icon: v.string().optional() }),
    ),
  })
  .describe('ScalingSummaryProject')
export type ScalingSummaryProject = v.infer<typeof ScalingSummaryProjectSchema>

export const ScalingSummarySchema = v
  .object({
    tvsTimestamp: v.number(),
    projects: v.array(ScalingSummaryProjectSchema),
  })
  .describe('ScalingSummary')
export type ScalingSummary = v.infer<typeof ScalingSummarySchema>
