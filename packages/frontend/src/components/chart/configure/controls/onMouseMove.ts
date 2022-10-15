import { Message } from '../messages'

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
      e.clientX >= rect.left - 16 &&
      e.clientX <= rect.right + 16 &&
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
