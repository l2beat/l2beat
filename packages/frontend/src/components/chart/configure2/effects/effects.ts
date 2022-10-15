export interface FetchAggregateTvlEffect {
  type: 'FetchAggregateTvl'
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
  url: string
}

export interface FetchActivityEffect {
  type: 'FetchActivity'
  requestId: number
  url: string
}

export type Effect =
  | FetchAggregateTvlEffect
  | FetchAlternativeTvlEffect
  | FetchTokenTvlEffect
  | FetchActivityEffect
