import { Box } from '../State'

export function boxContains(box: Box, x: number, y: number): boolean {
  return (
    x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height
  )
}
