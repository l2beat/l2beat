export type IndexerEffect =
  | UpdateEffect
  | InvalidateEffect
  | SetSafeHeightEffect
  | NotifyReadyEffect
  | TickEffect

export interface UpdateEffect {
  type: 'Update'
  targetHeight: number
}

export interface InvalidateEffect {
  type: 'Invalidate'
  targetHeight: number
}

export interface SetSafeHeightEffect {
  type: 'SetSafeHeight'
  safeHeight: number
}

export interface NotifyReadyEffect {
  type: 'NotifyReady'
  parentIndices: number[]
}

export interface TickEffect {
  type: 'Tick'
}
