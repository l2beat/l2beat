import { continueOperations } from '../helpers/continueOperations'
import type { ChildReadyAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleChildReady(
  state: IndexerState,
  action: ChildReadyAction,
): IndexerReducerResult {
  const newState: IndexerState = {
    ...state,
    children: state.children.map((child, index) =>
      index === action.index ? { ...child, ready: true } : child,
    ),
  }
  return continueOperations(newState)
}
