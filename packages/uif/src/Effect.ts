export type Effect = UpdateEffect | InvalidateEffect | UpdateHeightEffect

export interface UpdateEffect {
  type: 'Update'
  to: number
}

export interface InvalidateEffect {
  type: 'Invalidate'
  to: number
}

export interface UpdateHeightEffect {
  type: 'UpdateHeight'
  to: number
}
