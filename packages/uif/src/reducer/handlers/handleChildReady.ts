import { continueOperations } from '../helpers/continueOperations'
import { ChildReadyAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

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
