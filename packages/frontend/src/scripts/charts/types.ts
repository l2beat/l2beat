import { Milestone } from '@l2beat/config'
import { AssetType } from '@l2beat/shared-pure'
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
      ebv: number
      cbv: number
      nmv: number
    }
    date: string
    usd: number
    eth: number
    usdParts: {
      ebv: number
      cbv: number
      nmv: number
    }
    ethParts: {
      ebv: number
      cbv: number
      nmv: number
    }
    milestone?: Milestone
  }[]
}

export interface TokenDetailedTvlChart {
  type: 'TokenDetailedTvlChart'
  assetType: AssetType
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
const AggregateTvlChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.literal('usd'), z.literal('eth')]),
  data: z.array(z.tuple([z.number(), z.number(), z.number()])),
})

export type AggregateTvlResponse = z.infer<typeof AggregateTvlResponse>
export const AggregateTvlResponse = z.object({
  hourly: AggregateTvlChart,
  sixHourly: AggregateTvlChart,
  daily: AggregateTvlChart,
})
const AggregateDetailedTvlChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('valueUsd'),
    z.literal('cbvUsd'),
    z.literal('ebvUsd'),
    z.literal('nmvUsd'),
    z.literal('valueEth'),
    z.literal('cbvEth'),
    z.literal('ebvEth'),
    z.literal('nmvEth'),
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
  types: z.tuple([z.literal('timestamp'), z.string(), z.literal('usd')]),
  data: z.array(z.tuple([z.number(), z.number(), z.number()])),
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
})

export type Milestones = z.infer<typeof Milestones>
export const Milestones = z.array(
  z.object({
    name: z.string(),
    link: z.string(),
    date: z.string(),
    description: z.optional(z.string()),
  }),
)
