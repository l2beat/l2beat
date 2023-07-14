export interface InitializedAction {
  type: 'Initialized'
  safeHeight: number
  childCount: number
}

export interface ParentUpdatedAction {
  type: 'ParentUpdated'
  index: number
  safeHeight: number
}

export interface ChildReadyAction {
  type: 'ChildReady'
  index: number
}

export interface UpdateSucceededAction {
  type: 'UpdateSucceeded'
  from: number
  height: number
}

export interface UpdateFailedAction {
  type: 'UpdateFailed'
  from: number
  height: number
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
  | ChildReadyAction
  | UpdateSucceededAction
  | UpdateFailedAction
  | InvalidateSucceededAction
  | InvalidateFailedAction
