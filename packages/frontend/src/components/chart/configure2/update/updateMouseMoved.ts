import { Effect } from '../effects/effects'
import { MouseMovedMessage } from '../messages'
import { State } from '../state/State'

export function updateMouseMoved(
  state: State,
  message: MouseMovedMessage,
): [State, Effect[]] {
  let showHoverAtIndex: number | undefined
  const points = state.view.chart?.points.length
  if (points) {
    // This only works if the points are evenly distributed
    showHoverAtIndex = Math.round(message.mouseX * (points - 1))
  }
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
