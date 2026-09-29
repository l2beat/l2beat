export interface ChainNodeLayout {
  x: number
  y: number
  radius: number
}
export type FlowsGraphLayout = Map<string, ChainNodeLayout>

const MIN_BUBBLE_RADIUS = 8
const MAX_BUBBLE_RADIUS = 50
const SMALL_SCREEN_MAX_BUBBLE_RADIUS = 35
const CENTER_BUBBLE_RADIUS = 58
const SMALL_SCREEN_CENTER_BUBBLE_RADIUS = 42
const RING_RADIUS_RATIO = 0.4
// A hub keeps its labels outside the ring, away from the spokes, so the
// ring is pulled in to leave them room
const HUB_RING_RADIUS_RATIO = 0.33

/**
 * Places chains evenly around a circle and sizes each bubble
 * using sqrt scaling of total volume (inflows + outflows).
 * Sqrt makes the bubble area proportional to volume. This means:
 *   - 10x volume → ~3.2x radius → 10x area
 *   - Low-volume chains still get a small but visible bubble (MIN_RADIUS = 8px)
 *
 * With a center chain the graph becomes a hub: that chain sits in the middle
 * with a fixed radius and the others go around it. Its volume is the sum of
 * everything flowing through it, so it is left out of the bubble scale.
 */
export function computeGraphLayout(
  chainIds: string[],
  chainVolumes: { chainId: string; totalVolume: number }[],
  size: number,
  isSmallScreen: boolean,
  topChainId?: string,
  centerChainId?: string,
): FlowsGraphLayout {
  const layout: FlowsGraphLayout = new Map()
  if (chainIds.length === 0 || size === 0) return layout

  const hasCenter =
    centerChainId !== undefined && chainIds.includes(centerChainId)
  const ringIds = hasCenter
    ? chainIds.filter((id) => id !== centerChainId)
    : chainIds

  const volumeMap = new Map(
    chainVolumes.map((cv) => [cv.chainId, cv.totalVolume]),
  )
  const maxVolume = Math.max(
    ...chainVolumes
      .filter((cv) => !hasCenter || cv.chainId !== centerChainId)
      .map((cv) => cv.totalVolume),
  )
  const maxBubbleRadius = isSmallScreen
    ? SMALL_SCREEN_MAX_BUBBLE_RADIUS
    : MAX_BUBBLE_RADIUS

  const spreadIds = spreadByVolume(ringIds, volumeMap, topChainId)

  const centerX = size / 2
  const centerY = size / 2
  const circleRadius =
    size * (hasCenter ? HUB_RING_RADIUS_RATIO : RING_RADIUS_RATIO)

  if (hasCenter) {
    layout.set(centerChainId, {
      x: centerX,
      y: centerY,
      radius: isSmallScreen
        ? SMALL_SCREEN_CENTER_BUBBLE_RADIUS
        : CENTER_BUBBLE_RADIUS,
    })
  }

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
 * If a top chain is provided, the final circular order is rotated to place it
 * at the top without changing adjacent chains.
 */
function spreadByVolume(
  chainIds: string[],
  volumeMap: Map<string, number>,
  topChainId?: string,
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

  if (!topChainId) return result

  const topChainIndex = result.indexOf(topChainId)
  if (topChainIndex === -1) return result

  return [...result.slice(topChainIndex), ...result.slice(0, topChainIndex)]
}
