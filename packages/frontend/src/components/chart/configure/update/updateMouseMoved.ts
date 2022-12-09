import { Effect } from '../effects/effects'
import { MouseMovedMessage } from '../messages'
import { State } from '../state/State'
import { getHoverIndex } from './view/getHoverIndex'
import { getMilestoneHover } from './view/getMilestoneHover'

const HOVER_BELOW_CHART = 12

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
  if (
    milestoneHoverAtIndex === undefined &&
    message.mouseY < HOVER_BELOW_CHART
  ) {
    showHoverAtIndex = undefined
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
