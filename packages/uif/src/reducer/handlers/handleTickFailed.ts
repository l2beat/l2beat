import { assertRoot } from '../helpers/assertRoot'
import { TickFailedAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleTickFailed(
  state: IndexerState,
  _action: TickFailedAction,
): IndexerReducerResult {
  assertRoot(state)
  return [{ ...state, status: 'errored' }, []]
}
