export interface ChainNodeLayout {
  x: number
  y: number
}

// Extra space reserved around the circle for chain name + net flow labels
const LABEL_PADDING = 0

// Places chains evenly around a circle
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

  const spreadIds = spreadByVolume(chainIds, volumeMap)

  const centerX = width / 2
  const centerY = height / 2
  const circleRadius = Math.min(width, height) * 0.42 - LABEL_PADDING

  for (let i = 0; i < spreadIds.length; i++) {
    const chainId = spreadIds[i]
    if (!chainId) continue
    // Start from the top (-π/2) and distribute evenly
    const angle = (2 * Math.PI * i) / spreadIds.length - Math.PI / 2

    layout.set(chainId, {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle),
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
