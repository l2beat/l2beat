import type { ChainNodeLayout } from './computeGraphLayout'

/**
 * Builds a quadratic bezier SVG path between two nodes.
 * The control point is pulled slightly toward the center of the graph
 * so that connections curve inward instead of overlapping as straight lines.
 */
export function getConnectionPath(
  src: ChainNodeLayout,
  dst: ChainNodeLayout,
  centerX: number,
  centerY: number,
): string {
  const midX = (src.x + dst.x) / 2
  const midY = (src.y + dst.y) / 2
  // Pull the midpoint 15% toward the center
  const ctrlX = midX + (centerX - midX) * 0.15
  const ctrlY = midY + (centerY - midY) * 0.15
  return `M ${src.x} ${src.y} Q ${ctrlX} ${ctrlY} ${dst.x} ${dst.y}`
}
