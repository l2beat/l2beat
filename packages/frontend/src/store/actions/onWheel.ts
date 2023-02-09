import { State } from '../State'
import {
  IS_MACOS,
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

    const desiredChange = -deltaY * ZOOM_SENSITIVITY
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
    const invert = event.shiftKey && !IS_MACOS
    return {
      transform: {
        offsetX: offsetX - (!invert ? event.deltaX : deltaY),
        offsetY: offsetY - (!invert ? event.deltaY : deltaX),
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
