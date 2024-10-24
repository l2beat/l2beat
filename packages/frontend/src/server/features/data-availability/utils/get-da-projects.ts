import { resolvedDaLayers } from '@l2beat/config/projects'

export function getUniqueProjectsInUse() {
  return [
    ...new Set(
      resolvedDaLayers
        .map((daLayer) =>
          daLayer.bridges.map((bridge) =>
            bridge.usedIn.map((project) => project.id),
          ),
        )
        .flat(2),
    ),
  ]
}
