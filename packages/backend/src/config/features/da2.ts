import type { Env } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig, ProjectService } from '@l2beat/config'

import { createHash } from 'crypto'
import { ProjectId, assertUnreachable, notUndefined } from '@l2beat/shared-pure'
import type {
  DaIndexedConfig,
  DataAvailabilityTrackingConfig2,
  LayerDaTrackingConfig,
} from '../Config'

export async function getDaTrackingConfig2(
  ps: ProjectService,
  env: Env,
): Promise<DataAvailabilityTrackingConfig2> {
  // TODO: automate it
  const ethereumEnabled = !!env.optionalString('ETHEREUM_BLOBSCAN_API_URL')
  const celestiaEnabled = !!env.optionalString('CELESTIA_BLOBS_API_URL')
  const availEnabled = !!env.optionalString('AVAIL_BLOBS_API_URL')

  const layers: LayerDaTrackingConfig[] = []
  // This is needed for MultiIndexer so we treat layer as project
  const projectsForLayers: DaIndexedConfig[] = []

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
      projectId: ProjectId('ethereum'),
      type: 'baseLayer' as const,
      daLayer: 'ethereum',
      sinceBlock: 19426618, // Start of Blobs on Ethereum
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
      startingBlock: 983042,
    })
    projectsForLayers.push({
      configurationId: createDaLayerConfigId('celestia'),
      projectId: ProjectId('celestia'),
      type: 'baseLayer' as const,
      daLayer: 'celestia',
      sinceBlock: 983042,
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
      projectId: ProjectId('avail'),
      type: 'baseLayer' as const,
      daLayer: 'avail',
      sinceBlock: 1,
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
): Promise<DaIndexedConfig[]> {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['isUpcoming'],
  })

  return projects
    .flatMap((project) => {
      return project.daTrackingConfig.map((config) => {
        const layer = enabledLayers.find((l) => l.name === config.daLayer)
        if (layer === undefined) {
          return undefined // Layer disabled, do not create config
        }

        const sinceBlock = Math.max(layer.startingBlock, config.sinceBlock)

        return {
          ...config,
          configurationId: createDaTrackingId(config),
          projectId: project.id,
          sinceBlock,
        }
      })
    })
    .filter(notUndefined)
}

function createDaTrackingId(config: ProjectDaTrackingConfig): string {
  const input = []

  input.push(config.type)
  input.push(config.daLayer)
  // we're running two versions of DA in parallel to rollout new features
  input.push('v2')

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
  const input = []
  input.push(daLayerName)
  // we're running two versions of DA in parallel to rollout new features
  input.push('v2')

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
