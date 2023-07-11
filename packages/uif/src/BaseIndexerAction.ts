export interface Initialized {
  type: 'Initialized'
  height: number
}

export interface ParentUpdated {
  type: 'ParentUpdated'
  index: number
  height: number
}

export interface UpdateSucceeded {
  type: 'UpdateSucceeded'
  from: number
  to: number
}

export interface UpdateFailed {
  type: 'UpdateFailed'
  from: number
  to: number
}

export interface InvalidateSucceeded {
  type: 'InvalidateSucceeded'
  height: number
}

export interface InvalidateFailed {
  type: 'InvalidateFailed'
  height: number
}

export type BaseIndexerAction =
  | Initialized
  | ParentUpdated
  | UpdateSucceeded
  | UpdateFailed
  | InvalidateSucceeded
  | InvalidateFailed
