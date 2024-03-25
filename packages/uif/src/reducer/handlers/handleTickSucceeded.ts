import { assertRoot } from '../helpers/assertRoot'
import { assertStatus } from '../helpers/assertStatus'
import { TickSucceededAction } from '../types/IndexerAction'
import { IndexerEffect } from '../types/IndexerEffect'
import { IndexerReducerResult } from '../types/IndexerReducerResult'
import { IndexerState } from '../types/IndexerState'

export function handleTickSucceeded(
  state: IndexerState,
  action: TickSucceededAction,
): IndexerReducerResult {
  assertRoot(state)
  assertStatus(state.status, 'ticking')
  const effects: IndexerEffect[] =
    action.safeHeight !== state.safeHeight
      ? [{ type: 'SetSafeHeight', safeHeight: action.safeHeight }]
      : []
  if (state.tickScheduled) {
    effects.push({ type: 'Tick' })
  }
  return [
    {
      ...state,
      status: state.tickScheduled ? 'ticking' : 'idle',
      tickScheduled: false,
      safeHeight: action.safeHeight,
      height: action.safeHeight,
      invalidateToHeight: action.safeHeight,
    },
    effects,
  ]
}
