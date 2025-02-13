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
  const ethereumEnabled = !!env.optionalString('ETHEREUM_BLOBSCAN_API_URL')
  const celesiaEnabled = !!env.optionalString('CELESTIA_BLOBS_API_URL')
  const availEnabled = !!env.optionalString('AVAIL_BLOBS_API_URL')

  return {
    ethereum: ethereumEnabled
      ? {
          blobscanUrl: env.string('ETHEREUM_BLOBSCAN_API_URL'),
          callsPerMinute: env.integer('BLOBSCAN_CALLS_PER_MINUTE', 60),
          firstBlockWithBlobsOnEthereum: 19426618,
        }
      : false,

    celestia: celesiaEnabled
      ? {
          url: env.string('CELESTIA_BLOBS_API_URL'),
          callsPerMinute: env.integer(
            'CELESTIA_BLOBS_API_CALLS_PER_MINUTE',
            60,
          ),
        }
      : false,

    avail: availEnabled
      ? {
          url: env.string('AVAIL_BLOBS_API_URL'),
          callsPerMinute: env.integer('AVAIL_BLOBS_API_CALLS_PER_MINUTE', 60),
        }
      : false,

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
