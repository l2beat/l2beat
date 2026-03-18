export interface ChainNodeLayout {
  x: number
  y: number
  radius: number
}

interface ChainVolumeInfo {
  chainId: string
  totalVolume: number
}

const MIN_RADIUS = 20
const MAX_RADIUS = 50
const LABEL_PADDING = 50

export function computeGraphLayout(
  chainIds: string[],
  chainVolumes: ChainVolumeInfo[],
  width: number,
  height: number,
): Map<string, ChainNodeLayout> {
  const layout = new Map<string, ChainNodeLayout>()
  if (chainIds.length === 0 || width === 0 || height === 0) return layout

  const volumeMap = new Map(chainVolumes.map((cv) => [cv.chainId, cv.totalVolume]))
  const maxVolume = Math.max(...chainVolumes.map((cv) => cv.totalVolume), 1)

  const centerX = width / 2
  const centerY = height / 2
  const circleRadius =
    Math.min(width, height) * 0.42 - LABEL_PADDING

  for (let i = 0; i < chainIds.length; i++) {
    const chainId = chainIds[i]!
    const angle = (2 * Math.PI * i) / chainIds.length - Math.PI / 2
    const volume = volumeMap.get(chainId) ?? 0
    const normalizedVolume = volume / maxVolume
    const radius =
      MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.sqrt(normalizedVolume)

    layout.set(chainId, {
      x: centerX + circleRadius * Math.cos(angle),
      y: centerY + circleRadius * Math.sin(angle),
      radius,
    })
  }

  return layout
}
