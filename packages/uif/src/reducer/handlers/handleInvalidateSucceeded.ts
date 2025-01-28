import { assertStatus } from '../helpers/assertStatus'
import { continueOperations } from '../helpers/continueOperations'
import type { InvalidateSucceededAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleInvalidateSucceeded(
  state: IndexerState,
  action: InvalidateSucceededAction,
): IndexerReducerResult {
  assertStatus(state.status, 'invalidating')
  return continueOperations({
    ...state,
    status: 'idle',
    height: action.targetHeight,
    invalidateToHeight: Math.min(action.targetHeight, state.invalidateToHeight),
    forceInvalidate: false,
  })
}
