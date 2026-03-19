export interface ChainNodeLayout {
  x: number
  y: number
  radius: number
}

const MIN_RADIUS = 8
const MAX_RADIUS = 50
/** Extra space reserved around the circle for chain name + net flow labels. */
const LABEL_PADDING = 50

/**
 * Places chains evenly around a circle and sizes each bubble
 * using sqrt scaling of total volume (inflows + outflows).
 *
 * sqrt makes the bubble **area** proportional to volume, which is
 * the standard way to size circles in data visualization. This means:
 *   - 10x volume → ~3.2x radius → 10x area (visually correct)
 *   - Differences at the top are clearly visible (unlike log)
 *   - Low-volume chains still get a small but visible bubble (MIN_RADIUS = 8px)
 */
export function computeGraphLayout(
  chainIds: string[],
  chainVolumes: { chainId: string; totalVolume: number }[],
  width: number,
  height: number,
): Map<string, ChainNodeLayout> {
  const layout = new Map<string, ChainNodeLayout>()
  if (chainIds.length === 0 || width === 0 || height === 0) return layout

  const volumeMap = new Map(
    chainVolumes.map((cv) => [cv.chainId, cv.totalVolume]),
  )
  const maxVolume = Math.max(...chainVolumes.map((cv) => cv.totalVolume), 1)

  const spreadIds = spreadByVolume(chainIds, volumeMap)

  const centerX = width / 2
  const centerY = height / 2
  const circleRadius = Math.min(width, height) * 0.42 - LABEL_PADDING

  for (let i = 0; i < spreadIds.length; i++) {
    const chainId = spreadIds[i]
    if (!chainId) continue
    // Start from the top (-π/2) and distribute evenly
    const angle = (2 * Math.PI * i) / spreadIds.length - Math.PI / 2

    // sqrt scaling: bubble area is proportional to volume
    const ratio = (volumeMap.get(chainId) ?? 0) / maxVolume
    const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.sqrt(ratio)

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
 *
 * Example with 6 chains sorted [A, B, C, D, E, F]:
 *   high = [A, B, C]  low = [D, E, F]
 *   result = [A, D, B, E, C, F]
 *   Circle: A─D─B─E─C─F─A  (big chains always separated by small ones)
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
