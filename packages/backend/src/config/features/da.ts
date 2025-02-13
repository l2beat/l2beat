import type { Env } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig, ProjectService } from '@l2beat/config'

import { createHash } from 'crypto'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../Config'

export async function getDaTrackingConfig(
  ps: ProjectService,
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

    projects: await getDaTrackingProjects(ps),
  }
}

async function getDaTrackingProjects(ps: ProjectService) {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['isUpcoming'],
  })

  return projects.map((project) => ({
    configurationId: createDaTrackingId(project.daTrackingConfig),
    projectId: project.id,
    config: project.daTrackingConfig,
  }))
}

function createDaTrackingId(config: ProjectDaTrackingConfig): string {
  const input = []

  input.push(config.type)
  input.push(config.daLayer)

  switch (config.type) {
    case 'ethereum':
      input.push(config.inbox)
      if (config.sequencers) {
        input.push(...config.sequencers.sort((a, b) => a.localeCompare(b)))
      }
      break
    case 'celestia':
      input.push(config.namespace)
      break
    case 'avail':
      input.push(config.appId)
      break

    default:
      assertUnreachable(config)
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
