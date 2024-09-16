import { bridges, layer2s, layer3s } from '@l2beat/config'

export function slugToDisplayName(slug: string): string {
  if (slug === 'ethereum') {
    return 'Ethereum'
  }
  const isL2 = layer2s.find((l2) => l2.id === slug)
  if (isL2 !== undefined) {
    return isL2.display.name
  }
  const isL3 = layer3s.find((l3) => l3.id === slug)
  if (isL3 !== undefined) {
    return isL3.display.name
  }
  const isBridge = bridges.find((bridge) => bridge.id === slug)
  if (isBridge !== undefined) {
    return isBridge.display.name
  }

  throw new Error(`Unknown chain slug: ${slug}`)
}
