import type { Box, State } from '../State'

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
