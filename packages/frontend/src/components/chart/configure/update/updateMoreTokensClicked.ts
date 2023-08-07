import { Effect } from '../effects/effects'
import { State } from '../state/State'

// TODO(radomski): To be removed when L2 Assets are ready
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
