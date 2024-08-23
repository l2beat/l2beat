import { Milestone } from '@l2beat/config'
import { z } from 'zod'

export interface AggregateTvlChart {
  type: 'AggregateTvlChart'
  points: {
    x: number
    y: number
    date: string
    usd: number
    eth: number
    milestone?: Milestone
  }[]
}

export interface AggregateDetailedTvlChart {
  type: 'AggregateDetailedTvlChart'
  points: {
    x: number
    y: number
    parts: {
      external: number
      canonical: number
      native: number
    }
    date: string
    usd: number
    eth: number
    usdParts: {
      external: number
      canonical: number
      native: number
    }
    ethParts: {
      external: number
      canonical: number
      native: number
    }
    milestone?: Milestone
  }[]
}

export interface TokenDetailedTvlChart {
  type: 'TokenDetailedTvlChart'
  source: string
  points: {
    x: number
    y: number
    date: string
    balance: number
    symbol: string
    usd: number
    milestone?: Milestone
  }[]
}

export interface TokenTvlChart {
  type: 'TokenTvlChart'
  points: {
    x: number
    y: number
    date: string
    balance: number
    symbol: string
    usd: number
    milestone?: Milestone
  }[]
}

export interface ActivityChart {
  type: 'ActivityChart'
  points: {
    x: number
    y: number
    y2: number
    date: string
    tps: number
    ethereumTps: number
    milestone?: Milestone
  }[]
}

const AggregateDetailedTvlChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('totalUsd'),
    z.literal('canonicalUsd'),
    z.literal('externalUsd'),
    z.literal('nativeUsd'),
    z.literal('totalEth'),
    z.literal('canonicalEth'),
    z.literal('externalEth'),
    z.literal('nativeEth'),
  ]),
  data: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
    ]),
  ),
})

export type AggregateDetailedTvlResponse = z.infer<
  typeof AggregateDetailedTvlResponse
>
export const AggregateDetailedTvlResponse = z.object({
  hourly: AggregateDetailedTvlChart,
  sixHourly: AggregateDetailedTvlChart,
  daily: AggregateDetailedTvlChart,
})
const TokenTvlChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.string(), z.literal('valueUsd')]),
  data: z.array(z.tuple([z.number(), z.number(), z.number()])),
})

export type CostsChart = z.infer<typeof CostsChart>
const CostsChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('totalGas'),
    z.literal('totalEth'),
    z.literal('totalUsd'),
    z.literal('overheadGas'),
    z.literal('overheadEth'),
    z.literal('overheadUsd'),
    z.literal('calldataGas'),
    z.literal('calldataEth'),
    z.literal('calldataUsd'),
    z.literal('computeGas'),
    z.literal('computeEth'),
    z.literal('computeUsd'),
    z.literal('blobsGas'),
    z.literal('blobsEth'),
    z.literal('blobsUsd'),
  ]),
  data: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z
        .number()
        .nullable()
        .transform((x) => x ?? 0),
      z
        .number()
        .nullable()
        .transform((x) => x ?? 0),
      z
        .number()
        .nullable()
        .transform((x) => x ?? 0),
    ]),
  ),
})

export type CostsResponse = z.infer<typeof CostsResponse>
export const CostsResponse = z.object({
  hourly: CostsChart,
  daily: CostsChart,
})

export type TokenTvlResponse = z.infer<typeof TokenTvlResponse>
export const TokenTvlResponse = z.object({
  hourly: TokenTvlChart,
  sixHourly: TokenTvlChart,
  daily: TokenTvlChart,
})

export type ActivityResponse = z.infer<typeof ActivityResponse>
export const ActivityResponse = z.object({
  daily: z.object({
    types: z.tuple([
      z.literal('timestamp'),
      z.literal('transactions'),
      z.literal('ethereumTransactions'),
    ]),
    data: z.array(z.tuple([z.number(), z.number(), z.number()])),
  }),
  estimatedImpact: z.number().gte(0).lte(1).optional(),
  estimatedSince: z.number().optional(),
})

export type Milestones = z.infer<typeof Milestones>
export const Milestones = z.array(
  z.object({
    name: z.string(),
    link: z.string(),
    date: z.string(),
    description: z.optional(z.string()),
    type: z.enum(['general', 'incident']),
  }),
)
export type TokenInfo = z.infer<typeof TokenInfo>
export const TokenInfo = z.object({
  source: z.union([
    z.literal('regular'),
    z.literal('canonical'),
    z.literal('external'),
    z.literal('native'),
  ]),
  projectId: z.string(),
  chain: z.string(),
  address: z.string(),
  symbol: z.string(),
})

export type ChartType = z.infer<typeof ChartType>
export const ChartType = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('scaling-tvl'),
    filteredSlugs: z.array(z.string()).optional(),
    excludeAssociatedTokens: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('scaling-detailed-tvl'),
    filteredSlugs: z.array(z.string()).optional(),
    excludeAssociatedTokens: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('scaling-activity'),
    filteredSlugs: z.array(z.string()).optional(),
  }),
  z.object({ type: z.literal('bridges-tvl') }),
  z.object({ type: z.literal('project-tvl'), slug: z.string() }),
  z.object({
    type: z.literal('project-token-tvl'),
    info: TokenInfo,
  }),
  z.object({ type: z.literal('project-detailed-tvl'), slug: z.string() }),
  z.object({ type: z.literal('project-costs'), slug: z.string() }),
  z.object({ type: z.literal('project-activity'), slug: z.string() }),
  z.object({ type: z.literal('storybook-fake-tvl') }),
  z.object({ type: z.literal('storybook-fake-activity') }),
  z.object({ type: z.literal('storybook-fake-detailed-tvl') }),
  z.object({ type: z.literal('storybook-fake-costs') }),
])
