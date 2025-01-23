import { assertStatus } from '../helpers/assertStatus'
import { continueOperations } from '../helpers/continueOperations'
import type { UpdateFailedAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleUpdateFailed(
  state: IndexerState,
  action: UpdateFailedAction,
): IndexerReducerResult {
  assertStatus(state.status, 'updating')
  if (action.fatal) {
    return [{ ...state, status: 'errored' }, []]
  }

  return continueOperations(
    { ...state, status: 'idle', forceInvalidate: true },
    { updateFailed: true },
  )
}
