import { daLayers, ethereumDaLayer } from '@l2beat/config'

export function getUniqueProjectsInUse() {
  return [
    ...new Set(
      [...daLayers, ethereumDaLayer]
        .map((daLayer) =>
          daLayer.bridges.map((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        )
        .flat(2),
    ),
  ]
}
