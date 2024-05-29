import { State } from '../State'
import {
  MAX_ZOOM,
  MIN_ZOOM,
  SCROLL_LINE_HEIGHT,
  SCROLL_PAGE_HEIGHT,
  ZOOM_SENSITIVITY,
} from '../utils/constants'

export function onWheel(
  state: State,
  event: WheelEvent,
  view: HTMLElement,
): Partial<State> {
  event.preventDefault()
  const { deltaX, deltaY } = getWheelDelta(event)
  const { offsetX, offsetY, scale } = state.transform

  if (event.ctrlKey || event.metaKey) {
    const rect = view.getBoundingClientRect()

    let desiredChange = -deltaY * ZOOM_SENSITIVITY
    if (event.ctrlKey && !state.pressed.ctrlKey) {
      // NOTE(radomski): This is a magic value but there is no other way to
      // handle this nicely in a compact way. The `onwheel` event triggers
      // for mouse scrolling, touchpad scrolling AND touchpad pinching.
      // Pinching is the only case where the numbers are reaaaaaaaly small
      // for some reason. We multiply this by 8 to get a delta that feels
      // more natural.
      //
      // You know that the event is a pinch event when the `ctrlKey` is set.
      // Yes. Really. I'm not joking.
      desiredChange = desiredChange * 8
    }

    let newScale = scale * (1 + desiredChange)
    newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale))
    const change = newScale / scale - 1

    return {
      transform: {
        offsetX: offsetX + (rect.left - event.clientX) * change,
        offsetY: offsetY + (rect.top - event.clientY) * change,
        scale: scale * (1 + change),
      },
    }
  } else {
    return {
      transform: {
        offsetX: offsetX - deltaX,
        offsetY: offsetY - deltaY,
        scale,
      },
    }
  }
}

function getWheelDelta(event: WheelEvent) {
  let pixelsPerUnit = 1
  if (event.deltaMode === 1) {
    pixelsPerUnit = SCROLL_LINE_HEIGHT
  }
  if (event.deltaMode === 2) {
    pixelsPerUnit = SCROLL_PAGE_HEIGHT
  }

  return {
    deltaX: event.deltaX * pixelsPerUnit,
    deltaY: event.deltaY * pixelsPerUnit,
  }
}
