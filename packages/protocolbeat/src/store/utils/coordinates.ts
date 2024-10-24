import type { Box, CameraTransform } from '../State'

export function toViewCoordinates(
  event: MouseEvent,
  container: HTMLElement,
  { offsetX, offsetY, scale }: CameraTransform,
) {
  const rect = container.getBoundingClientRect()
  console.log(event.clientX, rect.left, offsetX, scale)
  console.log(event.clientY, rect.top, offsetY, scale)
  return {
    x: (event.clientX - rect.left - offsetX) / scale,
    y: (event.clientY - rect.top - offsetY) / scale,
  }
}

export function toViewportBox(box: Box, xform: CameraTransform): Box {
  return {
    x: xform.offsetX + box.x * xform.scale,
    y: xform.offsetY + box.y * xform.scale,
    width: box.width * xform.scale,
    height: box.height * xform.scale,
  }
}

export function toViewportXY(
  x: number,
  y: number,
  xform: CameraTransform,
): [number, number] {
  return [xform.offsetX + x * xform.scale, xform.offsetY + y * xform.scale]
}
