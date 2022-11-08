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
  responses: {
    aggregateTvl: AggregateTvlResponse | undefined
    alternativeTvl: AggregateTvlResponse | undefined
    activity: ActivityResponse | undefined
    tokenTvl: Record<string, TokenTvlResponse | undefined>
  }
  controls: {
    view: 'tvl' | 'activity'
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
    chart: AggregateTvlChart | TokenTvlChart | ActivityChart | undefined
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
