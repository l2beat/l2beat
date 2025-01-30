import { daLayers, ethereumDaLayer, layer2s, layer3s } from '@l2beat/config'

import type {
  DaLayerTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export function getDaTrackingConfig(
  flags: FeatureFlags,
): DataAvailabilityTrackingConfig {
  return {
    layers: getDaLayers().filter((layer) => flags.isEnabled('da', layer)),
    projects: getProjectsWithDaTracking().filter((project) =>
      flags.isEnabled('da', project.id.toString()),
    ),
  }
}

function getDaLayers(): DaLayerTrackingConfig[] {
  return [
    ...new Set(
      [ethereumDaLayer, ...daLayers]
        .filter((daLayer) => daLayer.kind !== 'DA Service')
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
