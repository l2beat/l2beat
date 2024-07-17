import { daLayers } from '@l2beat/config'

export function getUniqueProjectsInUse() {
  return [
    ...new Set(
      daLayers
        .map((daLayer) => daLayer.bridges.map((bridge) => bridge.usedIn))
        .flat(2),
    ),
  ]
}
