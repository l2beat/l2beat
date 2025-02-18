import type { Env } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig, ProjectService } from '@l2beat/config'

import { createHash } from 'crypto'
import { assert, ProjectId, assertUnreachable } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../Config'

export async function getDaTrackingConfig(
  ps: ProjectService,
  env: Env,
): Promise<DataAvailabilityTrackingConfig> {
  // TODO: automate it
  const ethereumEnabled = !!env.optionalString('ETHEREUM_BLOBSCAN_API_URL')
  const celestiaEnabled = !!env.optionalString('CELESTIA_BLOBS_API_URL')
  const availEnabled = !!env.optionalString('AVAIL_BLOBS_API_URL')

  const layers = []
  // This is needed for MultiIndexer so we treat layer as project
  const projectsForLayers = []

  if (ethereumEnabled) {
    layers.push({
      type: 'ethereum' as const,
      name: 'ethereum',
      url: env.string('ETHEREUM_BLOBSCAN_API_URL'),
      callsPerMinute: env.integer('BLOBSCAN_CALLS_PER_MINUTE', 60),
      batchSize: env.integer('ETHEREUM_BLOBS_BATCH_SIZE', 2500),
      startingBlock: 19426618,
    })
    projectsForLayers.push({
      configurationId: createDaLayerConfigId('ethereum'),
      type: 'ethereum',
      config: {
        type: 'baseLayer' as const,
        daLayer: 'ethereum',
        projectId: ProjectId('ethereum'),
        sinceBlock: 19426618, // Start of Blobs on Ethereum
      },
    })
  }

  if (celestiaEnabled) {
    layers.push({
      type: 'celestia' as const,
      name: 'celestia',
      url: env.string('CELESTIA_BLOBS_API_URL'),
      callsPerMinute: env.integer(
        'CELESTIA_BLOBS_API_CALLS_PER_MINUTE',
        20_000,
      ),
      batchSize: env.integer('CELESTIA_BLOBS_BATCH_SIZE', 100),
      startingBlock: 1,
    })
    projectsForLayers.push({
      configurationId: createDaLayerConfigId('celestia'),
      type: 'celestia',
      config: {
        type: 'baseLayer' as const,
        daLayer: 'celestia',
        projectId: ProjectId('celestia'),
        sinceBlock: 1,
      },
    })
  }

  if (availEnabled) {
    layers.push({
      type: 'avail' as const,
      name: 'avail',
      url: env.string('AVAIL_BLOBS_API_URL'),
      callsPerMinute: env.integer('AVAIL_BLOBS_API_CALLS_PER_MINUTE', 2000),
      batchSize: env.integer('AVAIL_BLOBS_BATCH_SIZE', 100),
      startingBlock: 1,
    })
    projectsForLayers.push({
      configurationId: createDaLayerConfigId('avail'),
      type: 'avail',
      config: {
        type: 'baseLayer' as const,
        daLayer: 'avail',
        projectId: ProjectId('avail'),
        sinceBlock: 1,
      },
    })
  }

  const projects = await getDaTrackingProjects(ps, layers)
  const projectsWithBaseLayers = [...projectsForLayers, ...projects]

  return {
    layers,
    projects: projectsWithBaseLayers,
  }
}

async function getDaTrackingProjects(
  ps: ProjectService,
  enabledLayers: { name: string; startingBlock: number }[],
) {
  const projects = (
    await ps.getProjects({
      select: ['daTrackingConfig'],
      whereNot: ['isUpcoming'],
    })
  ).filter((p) =>
    enabledLayers.find((l) => l.name === p.daTrackingConfig.daLayer),
  )

  return projects.map((project) => {
    const layer = enabledLayers.find(
      (l) => l.name === project.daTrackingConfig.daLayer,
    )
    assert(layer, `No layer found for ${project.daTrackingConfig.daLayer}`)

    const sinceBlock =
      layer.startingBlock > project.daTrackingConfig.sinceBlock
        ? layer.startingBlock
        : project.daTrackingConfig.sinceBlock

    return {
      configurationId: createDaTrackingId(project.daTrackingConfig),
      config: {
        ...project.daTrackingConfig,
        projectId: project.id,
        sinceBlock,
      },
    }
  })
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

function createDaLayerConfigId(daLayerName: string): string {
  const hash = createHash('sha1').update(daLayerName).digest('hex')
  return hash.slice(0, 12)
}
