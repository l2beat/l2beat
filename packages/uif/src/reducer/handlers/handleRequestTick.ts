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
  // TODO: either tick is sync or we should remember to tick in the future
  assertStatus(state.status, ['idle', 'ticking'])
  if (state.status === 'ticking') {
    return [{ ...state, tickScheduled: true }, []]
  }
  return [
    { ...state, status: 'ticking', tickScheduled: false },
    [{ type: 'Tick' }],
  ]
}
