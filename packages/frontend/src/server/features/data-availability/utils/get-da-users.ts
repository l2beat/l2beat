import type { Project } from '@l2beat/config'
import { layer2s, layer3s } from '@l2beat/config'

export function getDaUsers(
  layers: Project<'daLayer'>[],
  bridges: Project<'daBridge'>[],
) {
  const custom = [...layer2s, ...layer3s]
    .filter((project) => project.customDa)
    .map((project) => project.id)
  const all = [
    ...layers.flatMap((p) => p.daLayer.usedWithoutBridgeIn.map((x) => x.id)),
    ...bridges.flatMap((p) => p.daBridge.usedIn.map((x) => x.id)),
    ...custom,
  ]
  return [...new Set(all)]
}
