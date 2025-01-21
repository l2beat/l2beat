import { continueOperations } from '../helpers/continueOperations'
import { finishInitialization } from '../helpers/finishInitialization'
import type { ParentUpdatedAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleParentUpdated(
  state: IndexerState,
  action: ParentUpdatedAction,
): IndexerReducerResult {
  const newState: IndexerState = {
    ...state,
    parents: state.parents.map((parent, index) => {
      if (index === action.index) {
        const waiting = parent.waiting || action.safeHeight < parent.safeHeight
        return {
          ...parent,
          safeHeight: action.safeHeight,
          initialized: true,
          waiting: parent.initialized ? waiting : false,
        }
      }
      return parent
    }),
  }

  const result = finishInitialization(newState)
  if (result) {
    return result
  }

  return continueOperations(newState)
}
