import type { Env } from '@l2beat/backend-tools'
import { type ProjectService, layer2s, layer3s } from '@l2beat/config'
import type {
  DaLayerTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export async function getDaTrackingConfig(
  ps: ProjectService,
  flags: FeatureFlags,
  env: Env,
): Promise<DataAvailabilityTrackingConfig> {
  return {
    blobscan: {
      baseUrl: env.string('BLOBSCAN_API_URL', 'https://api.blobscan.com/'),
      callsPerMinute: env.integer('BLOBSCAN_CALLS_PER_MINUTE', 300),
      timeout: env.integer('BLOBSCAN_TIMEOUT', 30_000),
    },
    ethereum: {
      minHeight: env.integer('DA_ETHEREUM_MIN_HEIGHT', 19426618), // blobs
      batchSize: env.integer('DA_ETHEREUM_BATCH_SIZE', 2500),
    },
    layers: (await getDaTrackingLayers(ps)).filter((layer) =>
      flags.isEnabled('da', layer),
    ),
    projects: getProjectsWithDaTracking().filter((project) =>
      flags.isEnabled('da', project.id.toString()),
    ),
  }
}

async function getDaTrackingLayers(
  ps: ProjectService,
): Promise<DaLayerTrackingConfig[]> {
  const projects = await ps.getProjects({
    select: ['daLayer'],
    whereNot: ['isUpcoming'],
  })
  return [
    ...new Set(projects.flatMap((project) => project.daLayer.daTracking ?? [])),
  ]
}

function getProjectsWithDaTracking(): {
  id: ProjectId
  config: ProjectDaTrackingConfig
}[] {
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isArchived,
  )

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
