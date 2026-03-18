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

  const centerX = width / 2
  const centerY = height / 2
  const circleRadius = Math.min(width, height) * 0.42 - LABEL_PADDING

  for (let i = 0; i < chainIds.length; i++) {
    const chainId = chainIds[i]!
    // Start from the top (-π/2) and distribute evenly
    const angle = (2 * Math.PI * i) / chainIds.length - Math.PI / 2

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
