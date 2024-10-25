import type { State } from '../State'
import {
  CLICKED_LEFT_MOUSE_BUTTON,
  CLICKED_MIDDLE_MOUSE_BUTTON,
} from '../utils/constants'

export function onMouseUp(state: State, event: MouseEvent): Partial<State> {
  if (event.button === CLICKED_LEFT_MOUSE_BUTTON) {
    let selected = state.selected
    if (state.mouseUpAction?.type === 'DeselectOne') {
      const removeId = state.mouseUpAction.id
      selected = selected.filter((id) => id !== removeId)
    } else if (state.mouseUpAction?.type === 'DeselectAllBut') {
      selected = [state.mouseUpAction.id]
    }

    return {
      selected,
      positionsBeforeMove: {},
      input: { ...state.input, lmbPressed: false },
      mouseMoveAction: undefined,
      selection: undefined,
    }
  }

  if (event.button === CLICKED_MIDDLE_MOUSE_BUTTON) {
    return {
      input: { ...state.input, mmbPressed: false },
      mouseMoveAction:
        state.mouseMoveAction === 'pan' ? undefined : state.mouseMoveAction,
    }
  }

  return {}
}
