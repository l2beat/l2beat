import type { Milestone } from '@l2beat/config'
import { AssetType } from '@l2beat/shared-pure'

import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
  ChartType,
  TokenTvlResponse,
} from './state/State'

export interface InitMessage {
  type: 'Init'
  initialView: ChartType
  pagePathname: string
  days: number
  currency: 'usd' | 'eth'
  aggregateTvlEndpoint?: string
  aggregateDetailedTvlEndpoint?: string
  alternativeTvlEndpoint?: string
  detailedAggregateTvlEndpoint?: string
  activityEndpoint?: string
  showEthereum?: boolean
  labelCount: number
  milestones: Milestone[]
  isLogScale: boolean
}

export interface ViewChangedMessage {
  type: 'ViewChanged'
  view: ChartType
}

export interface DaysChangedMessage {
  type: 'DaysChanged'
  days: number
}

export interface CurrencyChangedMessage {
  type: 'CurrencyChanged'
  currency: 'usd' | 'eth'
}

export interface TokenChangedMessage {
  type: 'TokenChanged'
  token: string
  tokenEndpoint: string
  assetType: AssetType
}

export interface ShowEthereumChangedMessage {
  type: 'ShowEthereumChanged'
  showEthereum: boolean
}

export interface ScaleChangedMessage {
  type: 'ScaleChanged'
  isLogScale: boolean
}

export interface ShowAlternativeTvlChangedMessage {
  type: 'ShowAlternativeTvlChanged'
  showAlternativeTvl: boolean
}

export interface MouseMovedMessage {
  type: 'MouseMoved'
  mouseX: number
  mouseY: number
}

// TODO(radomski): To be removed when L2 Assets are ready
export interface MoreTokensClickedMessage {
  type: 'MoreTokensClicked'
}

export interface MouseExitedMessage {
  type: 'MouseExited'
}

export interface AggregateTvlLoadedMessage {
  type: 'AggregateTvlLoaded'
  requestId: number
  data: AggregateTvlResponse
}

export interface AggregateTvlFailedMessage {
  type: 'AggregateTvlFailed'
  requestId: number
}

export interface AggregateDetailedTvlLoadedMessage {
  type: 'AggregateDetailedTvlLoaded'
  requestId: number
  data: AggregateDetailedTvlResponse
}

export interface AggregateDetailedTvlFailedMessage {
  type: 'AggregateDetailedTvlFailed'
  requestId: number
}

export interface AlternativeTvlLoadedMessage {
  type: 'AlternativeTvlLoaded'
  requestId: number
  data: AggregateTvlResponse
}

export interface AlternativeTvlFailedMessage {
  type: 'AlternativeTvlFailed'
  requestId: number
}

export interface TokenTvlLoadedMessage {
  type: 'TokenTvlLoaded'
  requestId: number
  token: string
  assetType: AssetType
  data: TokenTvlResponse
}

export interface TokenTvlFailedMessage {
  type: 'TokenTvlFailed'
  requestId: number
}

export interface ActivityLoadedMessage {
  type: 'ActivityLoaded'
  requestId: number
  data: ActivityResponse
}

export interface ActivityFailedMessage {
  type: 'ActivityFailed'
  requestId: number
}

export interface LoaderTimedOutMessage {
  type: 'LoaderTimedOut'
  requestId: number
}

export interface ThemeChangedMessage {
  type: 'ThemeChanged'
  isDarkMode: boolean
}

export type Message =
  | InitMessage
  | ViewChangedMessage
  | DaysChangedMessage
  | CurrencyChangedMessage
  | TokenChangedMessage
  | ShowEthereumChangedMessage
  | ScaleChangedMessage
  | ShowAlternativeTvlChangedMessage
  | MouseMovedMessage
  | MoreTokensClickedMessage
  | MouseExitedMessage
  | AggregateDetailedTvlLoadedMessage
  | AggregateDetailedTvlFailedMessage
  | AggregateTvlLoadedMessage
  | AggregateTvlFailedMessage
  | AlternativeTvlLoadedMessage
  | AlternativeTvlFailedMessage
  | TokenTvlLoadedMessage
  | TokenTvlFailedMessage
  | ActivityLoadedMessage
  | ActivityFailedMessage
  | LoaderTimedOutMessage
  | ThemeChangedMessage
