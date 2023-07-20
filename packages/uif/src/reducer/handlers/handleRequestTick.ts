import { assertRoot } from '../helpers/assertRoot'
import { assertStatus } from '../helpers/assertStatus'
import { RequestTickAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleRequestTick(
  state: IndexerState,
  _action: RequestTickAction,
): IndexerReducerResult {
  assertRoot(state)

  if (state.status === 'errored' || state.tickBlocked) {
    return [state, []]
  }

  assertStatus(state.status, ['idle', 'ticking'])
  if (state.status === 'ticking') {
    return [{ ...state, tickScheduled: true }, []]
  }
  return [
    { ...state, status: 'ticking', tickScheduled: false },
    [{ type: 'Tick' }],
  ]
}
