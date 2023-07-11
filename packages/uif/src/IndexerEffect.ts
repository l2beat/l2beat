export type IndexerEffect = UpdateEffect | InvalidateEffect | SetHeightEffect

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
  to: number
}
