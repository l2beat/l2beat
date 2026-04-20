export interface ChainNodeLayout {
  x: number
  y: number
  radius: number
}
export type FlowsGraphLayout = Map<string, ChainNodeLayout>

const MIN_BUBBLE_RADIUS = 8
const MAX_BUBBLE_RADIUS = 50
const SMALL_SCREEN_MAX_BUBBLE_RADIUS = 35

/**
 * Places chains evenly around a circle and sizes each bubble
 * using sqrt scaling of total volume (inflows + outflows).
 * Sqrt makes the bubble area proportional to volume. This means:
 *   - 10x volume → ~3.2x radius → 10x area
 *   - Low-volume chains still get a small but visible bubble (MIN_RADIUS = 8px)
 */
export function computeGraphLayout(
  chainIds: string[],
  chainVolumes: { chainId: string; totalVolume: number }[],
  size: number,
  isSmallScreen: boolean,
): FlowsGraphLayout {
  const layout: FlowsGraphLayout = new Map()
  if (chainIds.length === 0 || size === 0) return layout

  const volumeMap = new Map(
    chainVolumes.map((cv) => [cv.chainId, cv.totalVolume]),
  )
  const maxVolume = Math.max(...chainVolumes.map((cv) => cv.totalVolume))
  const maxBubbleRadius = isSmallScreen
    ? SMALL_SCREEN_MAX_BUBBLE_RADIUS
    : MAX_BUBBLE_RADIUS

  const spreadIds = spreadByVolume(chainIds, volumeMap)

  const centerX = size / 2
  const centerY = size / 2
  const circleRadius = size * 0.4

  for (let i = 0; i < spreadIds.length; i++) {
    const chainId = spreadIds[i]
    if (!chainId) continue
    // Start from the top (-π/2) and distribute evenly
    const angle = (2 * Math.PI * i) / spreadIds.length - Math.PI / 2

    // sqrt scaling: bubble area is proportional to volume
    const ratio = maxVolume > 0 ? (volumeMap.get(chainId) ?? 0) / maxVolume : 0
    const radius = Math.max(
      MIN_BUBBLE_RADIUS,
      maxBubbleRadius * Math.sqrt(ratio),
    )

    layout.set(chainId, {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle),
      radius,
    })
  }

  return layout
}

/**
 * Reorders chains so that high-volume ones are never adjacent on the circle.
 *
 * Algorithm: sort by volume descending, split into a top half and bottom half,
 * then interleave them. This guarantees every high-volume chain is flanked
 * by two lower-volume chains.
 */
function spreadByVolume(
  chainIds: string[],
  volumeMap: Map<string, number>,
): string[] {
  if (chainIds.length <= 2) return chainIds

  const sorted = [...chainIds].sort(
    (a, b) => (volumeMap.get(b) ?? 0) - (volumeMap.get(a) ?? 0),
  )

  const mid = Math.ceil(sorted.length / 2)
  const high = sorted.slice(0, mid)
  const low = sorted.slice(mid)

  const result: string[] = []
  for (let i = 0; i < mid; i++) {
    const h = high[i]
    if (h) result.push(h)
    if (i < low.length) {
      const l = low[i]
      if (l) result.push(l)
    }
  }

  return result
}
