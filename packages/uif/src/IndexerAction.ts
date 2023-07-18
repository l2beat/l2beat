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
  targetHeight: number
}

export interface UpdateFailedAction {
  type: 'UpdateFailed'
  from: number
  targetHeight: number
}

export interface InvalidateSucceededAction {
  type: 'InvalidateSucceeded'
  targetHeight: number
}

export interface InvalidateFailedAction {
  type: 'InvalidateFailed'
  targetHeight: number
}

export interface RequestTickAction {
  type: 'RequestTick'
}

export interface TickSucceededAction {
  type: 'TickSucceeded'
  safeHeight: number
}

export interface TickFailedAction {
  type: 'TickFailed'
}

export type IndexerAction =
  | InitializedAction
  | ParentUpdatedAction
  | ChildReadyAction
  | UpdateSucceededAction
  | UpdateFailedAction
  | InvalidateSucceededAction
  | InvalidateFailedAction
  | RequestTickAction
  | TickSucceededAction
  | TickFailedAction
