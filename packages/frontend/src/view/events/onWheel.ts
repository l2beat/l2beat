import { State } from '../utils/State'

const ZOOM_SENSITIVITY = 0.02
const MAX_ZOOM = 3
const MIN_ZOOM = 0.3

export function onWheel(
  event: WheelEvent,
  state: State,
  view: HTMLElement,
): State {
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
      ...state,
      transform: {
        offsetX: offsetX + (rect.left - event.clientX) * change,
        offsetY: offsetY + (rect.top - event.clientY) * change,
        scale: scale * (1 + change),
      },
    }
  } else {
    const invert = event.shiftKey // TODO: shiftKey && !macos
    return {
      ...state,
      transform: {
        offsetX: offsetX - (!invert ? event.deltaX : deltaY),
        offsetY: offsetY - (!invert ? event.deltaY : deltaX),
        scale,
      },
    }
  }
}

// facebook's defaults
const LINE_HEIGHT = 40
const PAGE_HEIGHT = 800

function getWheelDelta(event: WheelEvent) {
  let pixelsPerUnit = 1
  if (event.deltaMode === 1) {
    // lines scrolled
    pixelsPerUnit = LINE_HEIGHT
  }
  if (event.deltaMode === 2) {
    // pages scrolled
    pixelsPerUnit = PAGE_HEIGHT
  }

  return {
    deltaX: event.deltaX * pixelsPerUnit,
    deltaY: event.deltaY * pixelsPerUnit,
  }
}
