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
  newHeight: number
}

export interface UpdateFailedAction {
  type: 'UpdateFailed'
  fatal?: boolean
}

export interface RetryUpdateAction {
  type: 'RetryUpdate'
}

export interface InvalidateSucceededAction {
  type: 'InvalidateSucceeded'
  targetHeight: number
}

export interface InvalidateFailedAction {
  type: 'InvalidateFailed'
  fatal?: boolean
}

export interface RetryInvalidateAction {
  type: 'RetryInvalidate'
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
  fatal?: boolean
}

export interface RetryTickAction {
  type: 'RetryTick'
}

export type IndexerAction =
  | InitializedAction
  | ParentUpdatedAction
  | ChildReadyAction
  | UpdateSucceededAction
  | UpdateFailedAction
  | RetryUpdateAction
  | InvalidateSucceededAction
  | InvalidateFailedAction
  | RetryInvalidateAction
  | RequestTickAction
  | TickSucceededAction
  | TickFailedAction
  | RetryTickAction
