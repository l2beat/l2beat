import type { State, Tool } from '../State'
import {
  BACKSPACE_KEY,
  CTRL_KEY,
  DELETE_KEY,
  HAND_TOOL_KEY,
  SELECT_TOOL_KEY,
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
  const tool = toolForKey(event)
  if (tool !== undefined) {
    return { tool }
  }
  if (event.key === SHIFT_KEY) {
    // When shift is pressed we snap dragged nodes to an axis
    return updateNodePositions(state, {
      input: { ...state.input, shiftPressed: true },
    })
  }
  return state
}

// Excalidraw-style tool keys: V for the selection tool, H for the hand tool.
function toolForKey(event: KeyboardEvent): Tool | undefined {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
    return undefined
  }
  switch (event.key.toLowerCase()) {
    case SELECT_TOOL_KEY:
      return 'select'
    case HAND_TOOL_KEY:
      return 'hand'
    default:
      return undefined
  }
}
