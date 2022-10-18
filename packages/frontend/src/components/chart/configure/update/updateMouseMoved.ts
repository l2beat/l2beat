import { Effect } from '../effects/effects'
import { MouseMovedMessage } from '../messages'
import { State } from '../state/State'
import { getHoverIndex } from './view/getHoverIndex'

export function updateMouseMoved(
  state: State,
  message: MouseMovedMessage,
): [State, Effect[]] {
  const points = state.view.chart?.points.length
  const showHoverAtIndex = getHoverIndex(message.mouseX, points)
  const newState: State = {
    ...state,
    controls: {
      ...state.controls,
      mouseX: message.mouseX,
    },
    view: {
      ...state.view,
      showHoverAtIndex,
    },
  }
  return [newState, []]
}
