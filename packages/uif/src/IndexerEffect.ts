export type IndexerEffect =
  | UpdateEffect
  | InvalidateEffect
  | SetSafeHeightEffect
  | NotifyWaitingEffect
  | NotifyInvalidatedEffect
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

export interface NotifyWaitingEffect {
  type: 'NotifyWaiting'
  childIndices: number[]
}

export interface NotifyInvalidatedEffect {
  type: 'NotifyInvalidated'
  childIndices: number[]
  to: number
}

export interface NotifyReadyEffect {
  type: 'NotifyReady'
  parentIndices: number[]
}
