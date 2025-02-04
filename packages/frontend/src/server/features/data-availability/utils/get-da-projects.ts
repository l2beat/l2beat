import { daLayers, ethereumDaLayer, layer2s, layer3s } from '@l2beat/config'
import { getDaBridges } from './get-da-bridges'

export function getUniqueProjectsInUse() {
  const custom = [...layer2s, ...layer3s]
    .filter((project) => project.customDa)
    .map((project) => project.id)

  return [
    ...new Set(
      [...daLayers, ethereumDaLayer]
        .map((project) =>
          getDaBridges(project).map((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        )
        .flat(2),
    ),
    // These are derived from scaling projects
    ...custom,
  ]
}
