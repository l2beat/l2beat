export interface FetchAggregateTvlEffect {
  type: 'FetchAggregateTvl'
  requestId: number
  url: string
}

export interface FetchActivityEffect {
  type: 'FetchActivity'
  requestId: number
  url: string
}

export interface LoaderTimeoutEffect {
  type: 'LoaderTimeout'
  requestId: number
}

export type Effect =
  | FetchAggregateTvlEffect
  | FetchActivityEffect
  | LoaderTimeoutEffect
