import type { Box } from '../State'

export function boxContains(box: Box, x: number, y: number): boolean {
  return (
    x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height
  )
}

export function isResizable(box: Box, scale: number, x: number) {
  const offset = (box.x + box.width - x) * scale
  return scale > 0.4 && offset < 10
}

export function intersects(a: Box, b: Box) {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  )
}
