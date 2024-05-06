import { assertStatus } from '../helpers/assertStatus'
import { continueOperations } from '../helpers/continueOperations'
import { InvalidateFailedAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleInvalidateFailed(
  state: IndexerState,
  action: InvalidateFailedAction,
): IndexerReducerResult {
  assertStatus(state.status, 'invalidating')

  if (action.fatal) {
    return [{ ...state, status: 'errored' }, []]
  }

  return continueOperations(
    { ...state, status: 'idle' },
    { invalidateFailed: true },
  )
}
