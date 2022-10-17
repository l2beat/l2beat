import { Message } from '../messages'

const HOVER_AREA_EXTENSION_PX = 16

export function onMouseMove(
  view: HTMLElement,
  dispatch: (message: Message) => void,
) {
  let wasInside = false

  window.addEventListener('mousemove', (e) => onEvent(e))
  window.addEventListener('touchstart', (e) => onEvent(e.touches[0]))
  window.addEventListener('touchmove', (e) => onEvent(e.touches[0]))

  function onEvent(e: MouseEvent | Touch) {
    const rect = view.getBoundingClientRect()
    const isInside =
      e.clientX >= rect.left - HOVER_AREA_EXTENSION_PX &&
      e.clientX <= rect.right + HOVER_AREA_EXTENSION_PX &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    const position = (e.clientX - rect.left) / rect.width

    if (isInside) {
      dispatch({
        type: 'MouseMoved',
        mouseX: Math.min(1, Math.max(0, position)),
      })
    } else if (wasInside) {
      dispatch({ type: 'MouseExited' })
    }
    wasInside = isInside
  }
}
