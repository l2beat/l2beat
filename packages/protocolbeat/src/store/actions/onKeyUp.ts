import type { State } from '../State'
import { CTRL_KEY, SHIFT_KEY, SPACE_KEY } from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onKeyUp(state: State, event: KeyboardEvent): Partial<State> {
  if (event.key === SPACE_KEY) {
    return { pressed: { ...state.pressed, spaceKey: false } }
  }
  if (event.key === CTRL_KEY) {
    return { pressed: { ...state.pressed, ctrlKey: false } }
  }
  if (event.key === SHIFT_KEY) {
    return updateNodePositions({
      ...state,
      pressed: { ...state.pressed, shiftKey: false },
    })
  }
  return {}
}
