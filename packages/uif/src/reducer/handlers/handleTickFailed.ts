import { assertRoot } from '../helpers/assertRoot'
import type { TickFailedAction } from '../types/IndexerAction'
import type { IndexerReducerResult } from '../types/IndexerReducerResult'
import type { IndexerState } from '../types/IndexerState'

export function handleTickFailed(
  state: IndexerState,
  action: TickFailedAction,
): IndexerReducerResult {
  assertRoot(state)

  if (action.fatal) {
    return [{ ...state, status: 'errored', tickScheduled: false }, []]
  }

  return [
    { ...state, status: 'idle', tickScheduled: false, tickBlocked: true },
    [{ type: 'ScheduleRetryTick' }],
  ]
}
