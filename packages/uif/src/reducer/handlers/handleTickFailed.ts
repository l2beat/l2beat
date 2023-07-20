import { assertRoot } from '../helpers/assertRoot'
import { TickFailedAction } from '../types/IndexerAction'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

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
