import { State } from '../utils/State'

export function getViewCoordinates(
  event: MouseEvent,
  container: HTMLElement,
  { offsetX, offsetY, scale }: State['transform'],
) {
  const rect = container.getBoundingClientRect()
  return {
    x: (event.clientX - rect.left - offsetX) / scale,
    y: (event.clientY - rect.top - offsetY) / scale,
  }
}
