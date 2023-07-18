import { assertStatus } from '../helpers/assertStatus'
import { UpdateFailedAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleUpdateFailed(
  state: IndexerState,
  _action: UpdateFailedAction,
): IndexerReducerResult {
  assertStatus(state.status, 'updating')
  // TODO: retry, exponential back-off
  // TODO: if parent waiting, notify ready.
  return [{ ...state, status: 'errored' }, []]
}
