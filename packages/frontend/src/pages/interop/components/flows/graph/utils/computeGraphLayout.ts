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
 *
 * Around a hub the chains keep the order they are given in, clockwise from
 * the top. Large chains are kept apart elsewhere because a flow between two
 * neighbours is too short to read, and around a hub every flow runs to the
 * middle. They are spaced by their size there, so that large neighbours do
 * not overlap.
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

  const orderedIds = hasCenter
    ? startFrom(ringIds, topChainId)
    : spreadByVolume(ringIds, volumeMap, topChainId)

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

  const radii = orderedIds.map((chainId) => {
    // sqrt scaling: bubble area is proportional to volume
    const ratio = maxVolume > 0 ? (volumeMap.get(chainId) ?? 0) / maxVolume : 0
    return Math.max(MIN_BUBBLE_RADIUS, maxBubbleRadius * Math.sqrt(ratio))
  })
  const arcs = hasCenter ? spaceBySize(radii, circleRadius) : undefined

  for (let i = 0; i < orderedIds.length; i++) {
    const chainId = orderedIds[i]
    const radius = radii[i]
    if (!chainId || radius === undefined) continue
    // Start from the top (-π/2) and distribute evenly
    const angle =
      (arcs?.[i] ?? (2 * Math.PI * i) / orderedIds.length) - Math.PI / 2

    layout.set(chainId, {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle),
      radius,
    })
  }

  return layout
}

/**
 * Angle of each bubble from the first one, leaving the same gap between the
 * edges of every two neighbours. Returns nothing when the bubbles do not fit
 * on the ring, and they are then spread evenly.
 */
function spaceBySize(
  radii: number[],
  circleRadius: number,
): number[] | undefined {
  const circumference = 2 * Math.PI * circleRadius
  const taken = radii.reduce((sum, radius) => sum + 2 * radius, 0)
  const gap = (circumference - taken) / radii.length
  if (gap <= 0) return undefined

  let arc = 0
  return radii.map((radius, i) => {
    const previous = radii[i - 1]
    if (previous !== undefined) arc += previous + gap + radius
    return arc / circleRadius
  })
}

/** Turns the ring so that the given chain comes first. Keeps the order */
function startFrom(chainIds: string[], topChainId?: string): string[] {
  const index = topChainId ? chainIds.indexOf(topChainId) : -1
  if (index <= 0) return chainIds
  return [...chainIds.slice(index), ...chainIds.slice(0, index)]
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

  return startFrom(result, topChainId)
}
