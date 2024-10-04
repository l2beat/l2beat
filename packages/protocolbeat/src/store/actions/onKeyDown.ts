import type { State } from '../State'
import {
  BACKSPACE_KEY,
  CTRL_KEY,
  DELETE_KEY,
  SHIFT_KEY,
  SPACE_KEY,
} from '../utils/constants'
import { updateNodePositions } from '../utils/updateNodePositions'

export function onKeyDown(state: State, event: KeyboardEvent): Partial<State> {
  if (event.key === SPACE_KEY) {
    return { pressed: { ...state.pressed, spaceKey: true } }
  }
  if (event.key === CTRL_KEY) {
    return { pressed: { ...state.pressed, ctrlKey: true } }
  }
  if (event.key === DELETE_KEY || event.key === BACKSPACE_KEY) {
    return {
      hiddenNodesIds: state.hiddenNodesIds.concat(state.selectedNodeIds),
    }
  }
  if (event.key === SHIFT_KEY) {
    return updateNodePositions({
      ...state,
      pressed: { ...state.pressed, shiftKey: true },
    })
  }
  return {}
}
