import { Effect } from '../effects/effects'
import { State } from '../state/State'

export function updateMouseExited(state: State): [State, Effect[]] {
  const newState: State = {
    ...state,
    controls: {
      ...state.controls,
      mouseX: undefined,
    },
    view: {
      ...state.view,
      showHoverAtIndex: undefined,
    },
  }
  return [newState, []]
}
