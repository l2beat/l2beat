import {
  ActivityResponse,
  AggregateTvlResponse,
  TokenTvlResponse,
} from './state/State'

export interface InitMessage {
  type: 'Init'
  initialView: 'tvl' | 'activity'
  days: number
  aggregateTvlEndpoint: string | undefined
  alternativeTvlEndpoint: string | undefined
  activityEndpoint: string | undefined
  showEthereum: boolean
}

export interface ViewChangedMessage {
  type: 'ViewChanged'
  view: 'tvl' | 'activity'
}

export interface DaysChangedMessage {
  type: 'DaysChanged'
  days: number
}

export interface CurrencyChangedMessage {
  type: 'CurrencyChanged'
  currency: 'USD' | 'ETH'
}

export interface TokenChangedMessage {
  type: 'TokenChanged'
  token: string
  tokenEndpoint: string
}

export interface ShowEthereumChangedMessage {
  type: 'ShowEthereumChanged'
  showEthereum: boolean
}

export interface ScaleChangedMessage {
  type: 'ScaleChanged'
  isLogScale: boolean
}

export interface MouseMovedMessage {
  type: 'MouseMoved'
  x: number
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

export type Message =
  | InitMessage
  | ViewChangedMessage
  | DaysChangedMessage
  | CurrencyChangedMessage
  | TokenChangedMessage
  | ShowEthereumChangedMessage
  | ScaleChangedMessage
  | MouseMovedMessage
  | MouseExitedMessage
  | AggregateTvlLoadedMessage
  | AggregateTvlFailedMessage
  | AlternativeTvlLoadedMessage
  | AlternativeTvlFailedMessage
  | TokenTvlLoadedMessage
  | TokenTvlFailedMessage
  | ActivityLoadedMessage
  | ActivityFailedMessage
  | LoaderTimedOutMessage
