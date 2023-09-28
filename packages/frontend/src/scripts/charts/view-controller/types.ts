import { Milestone } from '@l2beat/config'

import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
  TokenTvlResponse,
} from '../../../components/chart/configure/state/State'

type ChartData =
  | ChartTvlData
  | ChartActivityData
  | ChartDetailedTvlData
  | ChartTokenTvlData

interface ChartTvlData {
  type: 'tvl'
  values: AggregateTvlResponse
}

interface ChartActivityData {
  type: 'activity'
  values: ActivityResponse
}

interface ChartDetailedTvlData {
  type: 'detailed-tvl'
  values: AggregateDetailedTvlResponse
}

interface ChartTokenTvlData {
  type: 'token-tvl'
  values: TokenTvlResponse
}

export interface ChartControlsState {
  data?: ChartData
  timeRangeInDays: number
  useAltCurrency?: boolean
  showEthereumTransactions?: boolean
  useLogScale: boolean
  tokenType: 'CBV' | 'EBV' | 'NMV'
  milestones: Record<number, Milestone>
}
