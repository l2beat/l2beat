import type { ChainNodeLayout } from './computeGraphLayout'

// Perpendicular offset (px) applied to separate bidirectional flows
export const BIDIRECTIONAL_OFFSET = 6

/**
 * Builds a quadratic bezier SVG path between two nodes.
 * The control point is pulled slightly toward the center of the graph
 * so that connections curve inward instead of overlapping as straight lines.
 *
 * `offset` is provided to how much the control point is shifted perpendicular
 * to the src→dst line so that bidirectional flows don't overlap.
 * Positive offset shifts to the right of the src→dst direction,
 * negative to the left.
 */
export function getConnectionPath(
  src: ChainNodeLayout,
  dst: ChainNodeLayout,
  centerX: number,
  centerY: number,
  offset: number,
): string {
  const midX = (src.x + dst.x) / 2
  const midY = (src.y + dst.y) / 2
  // Pull the midpoint 15% toward the center
  let ctrlX = midX + (centerX - midX) * 0.15
  let ctrlY = midY + (centerY - midY) * 0.15

  if (offset !== 0) {
    const dx = dst.x - src.x
    const dy = dst.y - src.y
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len > 0) {
      // Perpendicular unit vector (rotated 90° counter-clockwise)
      const px = -dy / len
      const py = dx / len
      ctrlX += px * offset
      ctrlY += py * offset
    }
  }

  return `M ${src.x} ${src.y} Q ${ctrlX} ${ctrlY} ${dst.x} ${dst.y}`
}
