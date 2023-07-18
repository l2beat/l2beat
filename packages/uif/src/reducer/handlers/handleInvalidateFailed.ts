import { assertStatus } from '../helpers/assertStatus'
import { InvalidateFailedAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleInvalidateFailed(
  state: IndexerState,
  _action: InvalidateFailedAction,
): IndexerReducerResult {
  assertStatus(state.status, 'invalidating')
  // TODO: retry, exponential back-off
  return [{ ...state, status: 'errored' }, []]
}
