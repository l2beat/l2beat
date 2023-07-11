export interface InitializedAction {
  type: 'Initialized'
  height: number
}

export interface ParentUpdatedAction {
  type: 'ParentUpdated'
  index: number
  height: number
}

export interface UpdateSucceededAction {
  type: 'UpdateSucceeded'
  from: number
  to: number
}

export interface UpdateFailedAction {
  type: 'UpdateFailed'
  from: number
  to: number
}

export interface InvalidateSucceededAction {
  type: 'InvalidateSucceeded'
  height: number
}

export interface InvalidateFailedAction {
  type: 'InvalidateFailed'
  height: number
}

export type IndexerAction =
  | InitializedAction
  | ParentUpdatedAction
  | UpdateSucceededAction
  | UpdateFailedAction
  | InvalidateSucceededAction
  | InvalidateFailedAction
