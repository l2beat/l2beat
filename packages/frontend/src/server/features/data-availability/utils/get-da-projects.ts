import { daLayers, ethereumDaLayer, layer2s, layer3s } from '@l2beat/config'

export function getUniqueProjectsInUse() {
  const custom = [...layer2s, ...layer3s]
    .filter((project) => project.dataAvailabilitySolution)
    .map((project) => project.id)

  return [
    ...new Set(
      [...daLayers, ethereumDaLayer]
        .map((project) =>
          project.daLayer.bridges.map((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        )
        .flat(2),
    ),
    // These are derived from scaling projects
    ...custom,
  ]
}
