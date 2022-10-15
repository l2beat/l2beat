export interface FetchAggregateTvlEffect {
  type: 'FetchAggregateTvlEffect'
  requestId: number
  url: string
}

export interface FetchActivityEffect {
  type: 'FetchActivityEffect'
  requestId: number
  url: string
}

export interface LoaderTimeoutEffect {
  type: 'LoaderTimeoutEffect'
  requestId: number
}

export type Effect =
  | FetchAggregateTvlEffect
  | FetchActivityEffect
  | LoaderTimeoutEffect
