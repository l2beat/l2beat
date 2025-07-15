import type { Env } from '@l2beat/backend-tools'
import type { ProjectDaTrackingConfig, ProjectService } from '@l2beat/config'
import {
  assertUnreachable,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  BlockDaIndexedConfig,
  BlockLayerDaTrackingConfig,
  DataAvailabilityTrackingConfig,
  TimestampDaIndexedConfig,
  TimestampLayerDaTrackingConfig,
} from '../Config'

export async function getDaTrackingConfig(
  ps: ProjectService,
  env: Env,
): Promise<DataAvailabilityTrackingConfig> {
  // TODO: automate it
  const ethereumEnabled = !!env.optionalString('ETHEREUM_BLOBSCAN_API_URL')
  const celestiaEnabled = !!env.optionalString('CELESTIA_BLOBS_API_URL')
  const availEnabled = !!env.optionalString('AVAIL_BLOBS_API_URL')
  const eigenDaEnabled =
    !!env.optionalString('EIGEN_DA_API_URL') &&
    !!env.optionalString('EIGEN_DA_PER_PROJECT_API_URL')

  const blockLayers: BlockLayerDaTrackingConfig[] = []
  const timestampLayers: TimestampLayerDaTrackingConfig[] = []
  // This is needed for MultiIndexer so we treat layer as project
  const blockProjectsForLayers: BlockDaIndexedConfig[] = []
  const timestampProjectsForLayers: TimestampDaIndexedConfig[] = []

  if (ethereumEnabled) {
    blockLayers.push({
      type: 'ethereum' as const,
      name: 'ethereum',
      url: env.string('ETHEREUM_BLOBSCAN_API_URL'),
      callsPerMinute: env.integer('BLOBSCAN_CALLS_PER_MINUTE', 60),
      batchSize: env.integer('ETHEREUM_BLOBS_BATCH_SIZE', 2500),
      startingBlock: 19426618,
    })
    blockProjectsForLayers.push({
      configurationId: createDaLayerConfigId('ethereum'),
      projectId: ProjectId('ethereum'),
      type: 'baseLayer' as const,
      daLayer: 'ethereum',
      sinceBlock: 19426618, // Start of Blobs on Ethereum
    })
  }

  if (celestiaEnabled) {
    blockLayers.push({
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
    blockProjectsForLayers.push({
      configurationId: createDaLayerConfigId('celestia'),
      projectId: ProjectId('celestia'),
      type: 'baseLayer' as const,
      daLayer: 'celestia',
      sinceBlock: 983042,
    })
  }

  if (availEnabled) {
    blockLayers.push({
      type: 'avail' as const,
      name: 'avail',
      url: env.string('AVAIL_BLOBS_API_URL'),
      callsPerMinute: env.integer('AVAIL_BLOBS_API_CALLS_PER_MINUTE', 2000),
      batchSize: env.integer('AVAIL_BLOBS_BATCH_SIZE', 100),
      startingBlock: 1,
    })
    blockProjectsForLayers.push({
      configurationId: createDaLayerConfigId('avail'),
      projectId: ProjectId('avail'),
      type: 'baseLayer' as const,
      daLayer: 'avail',
      sinceBlock: 1,
    })
  }

  if (eigenDaEnabled) {
    timestampLayers.push({
      type: 'eigen-da' as const,
      name: 'eigenda',
      url: env.string('EIGEN_DA_API_URL'),
      perProjectUrl: env.string('EIGEN_DA_PER_PROJECT_API_URL'),
      callsPerMinute: env.integer('EIGEN_DA_API_CALLS_PER_MINUTE', 2000),
      startingTimestamp: UnixTime.fromDate(
        new Date('2024-06-24T02:00:00.000Z'),
      ),
    })
    timestampProjectsForLayers.push({
      configurationId: createDaLayerConfigId('eigenda'),
      projectId: ProjectId('eigenda'),
      type: 'baseLayer' as const,
      daLayer: 'eigenda',
      sinceTimestamp: UnixTime.fromDate(new Date('2024-06-24T02:00:00.000Z')),
    })
  }

  const blockProjects = await getBlockDaTrackingProjects(ps, blockLayers)
  const blockProjectsWithBaseLayers = [
    ...blockProjectsForLayers,
    ...blockProjects,
  ]

  const timestampProjects = await getTimestampDaTrackingProjects(
    ps,
    timestampLayers,
  )
  const timestampProjectsWithBaseLayers = [
    ...timestampProjectsForLayers,
    ...timestampProjects,
  ]

  return {
    blockLayers,
    timestampLayers,
    blockProjects: blockProjectsWithBaseLayers,
    timestampProjects: timestampProjectsWithBaseLayers,
  }
}

async function getBlockDaTrackingProjects(
  ps: ProjectService,
  enabledLayers: BlockLayerDaTrackingConfig[],
): Promise<BlockDaIndexedConfig[]> {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['isUpcoming'],
  })

  return projects
    .flatMap((project) => {
      return project.daTrackingConfig
        .filter(
          (config) =>
            config.type === 'ethereum' ||
            config.type === 'celestia' ||
            config.type === 'avail',
        )
        .map((config) => {
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

async function getTimestampDaTrackingProjects(
  ps: ProjectService,
  enabledLayers: TimestampLayerDaTrackingConfig[],
): Promise<TimestampDaIndexedConfig[]> {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
    whereNot: ['isUpcoming'],
  })

  return projects
    .flatMap((project) => {
      return project.daTrackingConfig
        .filter((config) => config.type === 'eigen-da')
        .map((config) => {
          const layer = enabledLayers.find((l) => l.name === config.daLayer)
          if (layer === undefined) {
            return undefined // Layer disabled, do not create config
          }

          const sinceTimestamp = Math.max(
            layer.startingTimestamp,
            config.sinceTimestamp,
          )

          return {
            ...config,
            configurationId: createDaTrackingId(config),
            projectId: project.id,
            sinceTimestamp,
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
      if (config.topics) {
        input.push(...config.topics.sort((a, b) => a.localeCompare(b)))
      }
      break
    case 'celestia':
      input.push(config.namespace)
      break
    case 'avail':
      input.push(config.appId)
      break
    case 'eigen-da':
      input.push(config.customerId)
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
