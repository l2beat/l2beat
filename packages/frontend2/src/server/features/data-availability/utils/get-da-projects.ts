import { daLayers } from '@l2beat/config'

export function getUniqueProjectsInUse() {
  return [
    ...new Set(
      daLayers
        .map((daLayer) =>
          daLayer.bridges.map((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        )
        .flat(2),
    ),
  ]
}
