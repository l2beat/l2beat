import { Effect } from '../effects/effects'
import { MouseMovedMessage } from '../messages'
import { State } from '../state/State'
import { getHoverIndex } from './view/getHoverIndex'
import { getMilestoneHover } from './view/getMilestoneHover'

export function updateMouseMoved(
  state: State,
  message: MouseMovedMessage,
): [State, Effect[]] {
  const points = state.view.chart?.points.length

  let showHoverAtIndex = getHoverIndex(message.mouseX, points)
  let showMilestoneHover: boolean | undefined = undefined

  const milestoneHoverAtIndex = getMilestoneHover(
    message.mouseX,
    message.mouseY,
    state.view.chart?.points,
  )
  if (milestoneHoverAtIndex) {
    showHoverAtIndex = milestoneHoverAtIndex
    showMilestoneHover = true
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
      showMilestoneHover,
    },
  }
  return [newState, []]
}
