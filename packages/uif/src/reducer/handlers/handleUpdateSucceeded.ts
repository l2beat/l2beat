import { assertStatus } from '../helpers/assertStatus'
import { continueOperations } from '../helpers/continueOperations'
import type { UpdateSucceededAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleUpdateSucceeded(
  state: IndexerState,
  action: UpdateSucceededAction,
): IndexerReducerResult {
  assertStatus(state.status, 'updating')
  if (action.newHeight >= state.height) {
    state = {
      ...state,
      status: 'idle',
      height: action.newHeight,
      invalidateToHeight:
        state.invalidateToHeight === state.height && !state.forceInvalidate
          ? action.newHeight
          : state.invalidateToHeight,
    }
  } else {
    state = {
      ...state,
      status: 'idle',
      invalidateToHeight: Math.min(action.newHeight, state.invalidateToHeight),
      forceInvalidate: true,
    }
  }
  return continueOperations(state, { updateFinished: true })
}
