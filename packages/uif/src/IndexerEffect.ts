export type IndexerEffect =
  | UpdateEffect
  | InvalidateEffect
  | SetSafeHeightEffect
  | NotifyReadyEffect

export interface UpdateEffect {
  type: 'Update'
  to: number
}

export interface InvalidateEffect {
  type: 'Invalidate'
  to: number
}

export interface SetSafeHeightEffect {
  type: 'SetSafeHeight'
  safeHeight: number
}

export interface NotifyReadyEffect {
  type: 'NotifyReady'
  parentIndices: number[]
}
