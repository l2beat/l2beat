import { Effect } from '../effects/effects'
import { State } from '../state/State'

export function updateMoreTokensClicked(state: State): [State, Effect[]] {
  const newState: State = {
    ...state,
    controls: {
      ...state.controls,
      showMoreTokens: true,
    },
  }
  return [newState, []]
}
