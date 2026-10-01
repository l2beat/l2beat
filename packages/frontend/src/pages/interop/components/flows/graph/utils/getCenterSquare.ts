import type { ChainNodeLayout } from './computeGraphLayout'

export interface CenterSquare {
  x: number
  y: number
  size: number
  cornerRadius: number
}

/**
 * The hub of the graph sits on a rounded square rather than a disc like the
 * chains around it, so it reads as where the flows go and not as one more
 * chain. It is sized to hold the hub's icon and value.
 */
export function getCenterSquare({
  x,
  y,
  radius,
}: ChainNodeLayout): CenterSquare {
  const half = radius * 0.8
  return {
    x: x - half,
    y: y - half,
    size: 2 * half,
    cornerRadius: radius * 0.2,
  }
}

/** Closed path of the square, for punching it out of a clip path */
export function getCenterSquarePath({
  x,
  y,
  size,
  cornerRadius: r,
}: CenterSquare) {
  const right = x + size
  const bottom = y + size
  return [
    `M ${x + r} ${y}`,
    `H ${right - r}`,
    `A ${r} ${r} 0 0 1 ${right} ${y + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${bottom - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    'Z',
  ].join(' ')
}
