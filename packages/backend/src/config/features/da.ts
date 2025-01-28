import { daLayers, layer2s, layer3s } from '@l2beat/config'

import type {
  DaLayerTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../Config'

export function getDaTrackingConfig(): DataAvailabilityTrackingConfig {
  return {
    layers: getDaLayers(),
    projects: getProjectsWithDaTracking(),
  }
}

function getDaLayers(): DaLayerTrackingConfig[] {
  return [
    ...new Set(
      daLayers
        .filter((daLayer) => daLayer.kind === 'PublicBlockchain')
        .flatMap(({ daTracking }) => daTracking ?? []),
    ),
  ]
}

function getProjectsWithDaTracking(): {
  id: ProjectId
  config: ProjectDaTrackingConfig
}[] {
  const projects = [
    ...layer2s.filter((layer2) => !layer2.isArchived),
    ...layer3s,
  ]

  return projects.flatMap((project) =>
    project.config.daTracking
      ? [
          {
            id: project.id,
            config: project.config.daTracking,
          },
        ]
      : [],
  )
}
