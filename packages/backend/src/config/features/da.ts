import type { Env } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig, ProjectService } from '@l2beat/config'

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
    projects: (await getDaTrackingProjects(ps)).filter((project) =>
      flags.isEnabled('da', project.id.toString()),
    ),
  }
}

async function getDaTrackingProjects(ps: ProjectService): Promise<
  {
    id: ProjectId
    config: ProjectDaTrackingConfig
  }[]
> {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['isUpcoming'],
  })

  return projects.map((project) => ({
    id: project.id,
    config: project.daTrackingConfig,
  }))
}
