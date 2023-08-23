import { AssetType } from '@l2beat/shared-pure'

export interface FetchAggregateTvlEffect {
  type: 'FetchAggregateTvl'
  requestId: number
  url: string
}

export interface FetchDetailedAggregateTvlEffect {
  type: 'FetchDetailedAggregateTvl'
  requestId: number
  url: string
}

export interface FetchAlternativeTvlEffect {
  type: 'FetchAlternativeTvl'
  requestId: number
  url: string
}

export interface FetchTokenTvlEffect {
  type: 'FetchTokenTvl'
  requestId: number
  token: string
  assetType: AssetType
  url: string
}

export interface FetchActivityEffect {
  type: 'FetchActivity'
  requestId: number
  url: string
}

export type Effect =
  | FetchAggregateTvlEffect
  | FetchDetailedAggregateTvlEffect
  | FetchAlternativeTvlEffect
  | FetchTokenTvlEffect
  | FetchActivityEffect
