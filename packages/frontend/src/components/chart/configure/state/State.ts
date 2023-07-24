import { Milestone } from '@l2beat/config'
import { z } from 'zod'

export interface State {
  endpoints: {
    aggregateTvl: string | undefined
    alternativeTvl: string | undefined
    activity: string | undefined
  }
  request: {
    lastId: number
    isFetching: boolean
    showLoader: boolean
  }
  data: {
    aggregateTvl: AggregateTvlResponse | undefined
    aggregateDetailedTvl: AggregateDetailedTvlResponse | undefined
    alternativeTvl: AggregateTvlResponse | undefined
    activity: ActivityResponse | undefined
    tokenTvl: Record<string, TokenTvlResponse | undefined>
    milestones: Record<number, Milestone>
  }
  controls: {
    pagePathname: string
    theme: 'dark' | 'light'
    view: 'tvl' | 'detailedTvl' | 'activity'
    days: number
    isLogScale: boolean
    currency: 'usd' | 'eth'
    token: string | undefined
    showEthereum: boolean
    showAlternativeTvl: boolean
    mouseX: number | undefined
    showMoreTokens: boolean
    labelCount: number
  }
  view: {
    dateRange: string | undefined
    labels: string[] | undefined
    showHoverAtIndex: number | undefined
    showMilestoneHover: boolean | undefined
    chart:
      | AggregateTvlChart
      | AggregateDetailedTvlChart
      | TokenTvlChart
      | ActivityChart
      | undefined
  }
}

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

//TODO(radomski): Remove this, as it's only for debug purpose
export type AggregateDetailedTvlChartToRemove = z.infer<
  typeof AggregateDetailedTvlChart
>

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
