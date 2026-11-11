import type { State } from '../State'
import { CTRL_KEY, SHIFT_KEY } from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'

// Only modifiers that change what the mouse does. Shortcuts, like the hand
// tool held on Space, are keybindings.
export function onKeyDown(state: State, event: KeyboardEvent): Partial<State> {
  if (event.key === CTRL_KEY) {
    return { input: { ...state.input, ctrlPressed: true } }
  }
  if (event.key === SHIFT_KEY) {
    // When shift is pressed we snap dragged nodes to an axis
    return updateNodePositions(state, {
      input: { ...state.input, shiftPressed: true },
    })
  }
  return state
}
