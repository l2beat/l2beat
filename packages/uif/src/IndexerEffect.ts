export type IndexerEffect =
  | UpdateEffect
  | InvalidateEffect
  | SetHeightEffect
  | NotifyReadyEffect

export interface UpdateEffect {
  type: 'Update'
  to: number
}

export interface InvalidateEffect {
  type: 'Invalidate'
  to: number
}

export interface SetHeightEffect {
  type: 'SetHeight'
  height: number
}

export interface NotifyReadyEffect {
  type: 'NotifyReady'
  parentIndices: number[]
}
