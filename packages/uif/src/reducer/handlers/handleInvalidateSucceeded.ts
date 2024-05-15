import { assertStatus } from '../helpers/assertStatus'
import { continueOperations } from '../helpers/continueOperations'
import { InvalidateSucceededAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleInvalidateSucceeded(
  state: IndexerState,
  action: InvalidateSucceededAction,
): IndexerReducerResult {
  assertStatus(state.status, 'invalidating')
  return continueOperations({
    ...state,
    status: 'idle',
    height: action.targetHeight,
    forceInvalidate: false,
  })
}
