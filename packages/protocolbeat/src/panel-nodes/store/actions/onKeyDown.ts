import type { State } from '../State'
import {
  BACKSPACE_KEY,
  CTRL_KEY,
  DELETE_KEY,
  SHIFT_KEY,
  SPACE_KEY,
} from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'
import { hideSelected } from './other'

export function onKeyDown(state: State, event: KeyboardEvent): Partial<State> {
  if (event.key === SPACE_KEY) {
    return { input: { ...state.input, spacePressed: true } }
  }
  if (event.key === CTRL_KEY) {
    return { input: { ...state.input, ctrlPressed: true } }
  }
  if (event.key === DELETE_KEY || event.key === BACKSPACE_KEY) {
    return hideSelected(state)
  }
  if (event.key === SHIFT_KEY) {
    // When shift is pressed we snap dragged nodes to an axis
    return updateNodePositions({
      ...state,
      input: { ...state.input, shiftPressed: true },
    })
  }
  return state
}
