import { Message } from '../messages'

const HOVER_AREA_EXTENSION_PX = 16
const HOVER_BELOW_CHART = 15

export function onMouseMove(
  view: HTMLElement,
  dispatch: (message: Message) => void,
) {
  let wasInside = false

  window.addEventListener('mousemove', (e) => onEvent(e))
  window.addEventListener('touchmove', (e) => onEvent(e.touches[0]))

  function onEvent(e: MouseEvent | Touch) {
    const rect = view.getBoundingClientRect()
    // Each point on the chart except the first and the last has space on both
    // sides that causes it to show on hover. The first and the last only have
    // it to the right and left respectively. To combat this we extend this area
    // artificially by an arbitrary amount.
    const isInside =
      e.clientX >= rect.left - HOVER_AREA_EXTENSION_PX &&
      e.clientX <= rect.right + HOVER_AREA_EXTENSION_PX &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom + HOVER_BELOW_CHART
    const position = (e.clientX - rect.left) / rect.width

    if (isInside) {
      dispatch({
        type: 'MouseMoved',
        mouseX: Math.min(1, Math.max(0, position)),
        mouseY: Math.abs(
          e.clientY - rect.top - rect.height - HOVER_BELOW_CHART,
        ),
      })
    } else if (wasInside) {
      dispatch({ type: 'MouseExited' })
    }
    wasInside = isInside
  }
}
