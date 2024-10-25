import type { State } from '../State'
import { CTRL_KEY, SHIFT_KEY, SPACE_KEY } from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onKeyUp(state: State, event: KeyboardEvent): Partial<State> {
  if (event.key === SPACE_KEY) {
    return { input: { ...state.input, spacePressed: false } }
  }
  if (event.key === CTRL_KEY) {
    return { input: { ...state.input, ctrlPressed: false } }
  }
  if (event.key === SHIFT_KEY) {
    return updateNodePositions({
      ...state,
      input: { ...state.input, shiftPressed: false },
    })
  }
  return state
}
