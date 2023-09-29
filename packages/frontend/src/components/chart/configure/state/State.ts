import { Milestone } from '@l2beat/config'
import { AssetType } from '@l2beat/shared-pure'
import { z } from 'zod'

import {
  ActivityChart,
  ActivityResponse,
  AggregateDetailedTvlChart,
  AggregateDetailedTvlResponse,
  AggregateTvlChart,
  AggregateTvlResponse,
  TokenDetailedTvlChart,
  TokenTvlChart,
  TokenTvlResponse,
} from '../../../../scripts/charts/types'

export interface State {
  endpoints: {
    aggregateTvl: string | undefined
    aggregateDetailedTvl: string | undefined
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
    view: ChartType
    days: number
    isLogScale: boolean
    currency: 'usd' | 'eth'
    token: string | undefined
    // TODO(radomski): I don't like this, but I have no other idea
    assetType: AssetType | undefined
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
      | TokenDetailedTvlChart
      | ActivityChart
      | undefined
  }
}

export type ChartType = z.infer<typeof ChartType>
export const ChartType = z.union([
  z.literal('tvl'),
  z.literal('detailed-tvl'),
  z.literal('activity'),
  z.literal('token-tvl'),
])
