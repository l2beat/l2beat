import { Indexer } from './Indexer'

export interface InitializedAction {
  type: 'Initialized'
  height: number
  childCount: number
}

export interface ParentUpdatedAction {
  type: 'ParentUpdated'
  index: number
  to: number
}

export interface ChildSubscribedAction {
  type: 'ChildSubscribed'
}

export interface ChildUnsubscribedAction {
  type: 'ChildUnsubscribed'
  index: number
}

export interface ChildReadyAction {
  type: 'ChildReady'
  index: number
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
  to: number
}

export interface InvalidateFailedAction {
  type: 'InvalidateFailed'
  to: number
}

export type IndexerAction =
  | InitializedAction
  | ParentUpdatedAction
  | ChildSubscribedAction
  | ChildUnsubscribedAction
  | ChildReadyAction
  | UpdateSucceededAction
  | UpdateFailedAction
  | InvalidateSucceededAction
  | InvalidateFailedAction
