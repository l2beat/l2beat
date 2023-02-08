import { Box, State } from '../utils/State'

export function toViewCoordinates(
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

export function toContainerCoordinates(
  box: Box,
  { offsetX, offsetY, scale }: State['transform'],
): Box {
  return {
    x: box.x * scale + offsetX,
    y: box.y * scale + offsetY,
    width: box.width * scale,
    height: box.height * scale,
  }
}
