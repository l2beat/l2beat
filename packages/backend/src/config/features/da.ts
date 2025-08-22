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

const ETHEREUM_START_BLOCK = 19426618
const CELESTIA_START_BLOCK = 983042
const AVAIL_START_BLOCK = 1
const EIGEN_START_TIMESTAMP = UnixTime.fromDate(
  new Date('2024-06-24T02:00:00.000Z'),
)

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
  const sovereignBlockProjects: BlockDaIndexedConfig[] = []
  const sovereignTimestampProjects: TimestampDaIndexedConfig[] = []

  if (ethereumEnabled) {
    blockLayers.push({
      type: 'ethereum' as const,
      name: 'ethereum',
      url: env.string('ETHEREUM_BLOBSCAN_API_URL'),
      callsPerMinute: env.integer('BLOBSCAN_CALLS_PER_MINUTE', 60),
      batchSize: env.integer('ETHEREUM_BLOBS_BATCH_SIZE', 2500),
      startingBlock: ETHEREUM_START_BLOCK,
    })

    blockProjectsForLayers.push({
      configurationId: createDaLayerConfigId('ethereum'),
      projectId: ProjectId('ethereum'),
      type: 'baseLayer' as const,
      daLayer: 'ethereum',
      sinceBlock: ETHEREUM_START_BLOCK,
    })

    const sovereignProjectsOnEthereum =
      await getBlockDaTrackingSovereignProjects(
        ps,
        ProjectId('ethereum'),
        'ethereum',
        ETHEREUM_START_BLOCK,
      )
    sovereignBlockProjects.push(...sovereignProjectsOnEthereum)
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
      startingBlock: CELESTIA_START_BLOCK,
    })
    blockProjectsForLayers.push({
      configurationId: createDaLayerConfigId('celestia'),
      projectId: ProjectId('celestia'),
      type: 'baseLayer' as const,
      daLayer: 'celestia',
      sinceBlock: CELESTIA_START_BLOCK,
    })

    const sovereignProjectsOnCelestia =
      await getBlockDaTrackingSovereignProjects(
        ps,
        ProjectId('celestia'),
        'celestia',
        CELESTIA_START_BLOCK,
      )
    sovereignBlockProjects.push(...sovereignProjectsOnCelestia)
  }

  if (availEnabled) {
    blockLayers.push({
      type: 'avail' as const,
      name: 'avail',
      url: env.string('AVAIL_BLOBS_API_URL'),
      callsPerMinute: env.integer('AVAIL_BLOBS_API_CALLS_PER_MINUTE', 2000),
      batchSize: env.integer('AVAIL_BLOBS_BATCH_SIZE', 100),
      startingBlock: AVAIL_START_BLOCK,
    })
    blockProjectsForLayers.push({
      configurationId: createDaLayerConfigId('avail'),
      projectId: ProjectId('avail'),
      type: 'baseLayer' as const,
      daLayer: 'avail',
      sinceBlock: AVAIL_START_BLOCK,
    })

    const sovereignProjectsOnAvail = await getBlockDaTrackingSovereignProjects(
      ps,
      ProjectId('avail'),
      'avail',
      AVAIL_START_BLOCK,
    )
    sovereignBlockProjects.push(...sovereignProjectsOnAvail)
  }

  if (eigenDaEnabled) {
    timestampLayers.push({
      type: 'eigen-da' as const,
      name: 'eigenda',
      url: env.string('EIGEN_DA_API_URL'),
      perProjectUrl: env.string('EIGEN_DA_PER_PROJECT_API_URL'),
      callsPerMinute: env.integer('EIGEN_DA_API_CALLS_PER_MINUTE', 2000),
      startingTimestamp: EIGEN_START_TIMESTAMP,
    })
    timestampProjectsForLayers.push({
      configurationId: createDaLayerConfigId('eigenda'),
      projectId: ProjectId('eigenda'),
      type: 'baseLayer' as const,
      daLayer: 'eigenda',
      sinceTimestamp: EIGEN_START_TIMESTAMP,
    })

    const sovereignProjectsOnEigen =
      await getTimestampDaTrackingSovereignProjects(
        ps,
        ProjectId('eigenda'),
        EIGEN_START_TIMESTAMP,
      )
    sovereignTimestampProjects.push(...sovereignProjectsOnEigen)
  }

  const blockProjects = await getBlockDaTrackingProjects(ps, blockLayers)
  const allBlockProjects = [
    ...blockProjectsForLayers,
    ...blockProjects,
    ...sovereignBlockProjects,
  ]

  const timestampProjects = await getTimestampDaTrackingProjects(
    ps,
    timestampLayers,
  )
  const allTimestampProjects = [
    ...timestampProjectsForLayers,
    ...timestampProjects,
    ...sovereignTimestampProjects,
  ]

  return {
    blockLayers,
    timestampLayers,
    blockProjects: allBlockProjects,
    timestampProjects: allTimestampProjects,
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

async function getBlockDaTrackingSovereignProjects(
  ps: ProjectService,
  daLayerProjectId: ProjectId,
  daLayerProjectType: 'ethereum' | 'celestia' | 'avail',
  daLayerSinceBlock: number,
): Promise<BlockDaIndexedConfig[]> {
  const daLayerProject = await ps.getProject({
    id: daLayerProjectId,
    select: ['daLayer'],
  })

  if (
    !daLayerProject ||
    !daLayerProject.daLayer.sovereignProjectsTrackingConfig
  ) {
    return []
  }

  const indexedConfigs: BlockDaIndexedConfig[] = []

  for (const sovereignProjectConfig of daLayerProject.daLayer
    .sovereignProjectsTrackingConfig) {
    const trackingConfigs = sovereignProjectConfig.daTrackingConfig
      .filter(
        (c) =>
          c.type === 'ethereum' || c.type === 'celestia' || c.type === 'avail',
      )
      .filter((c) => c.type === daLayerProjectType)
      .map((c) => {
        const sinceBlock = Math.max(daLayerSinceBlock, c.sinceBlock)

        const withDaLayer = {
          daLayer: daLayerProjectId,
          ...c,
        }

        return {
          ...withDaLayer,
          configurationId: createDaTrackingId(withDaLayer),
          projectId: sovereignProjectConfig.projectId,
          sinceBlock,
        }
      })
    indexedConfigs.push(...trackingConfigs)
  }

  return indexedConfigs
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

async function getTimestampDaTrackingSovereignProjects(
  ps: ProjectService,
  daLayerProjectId: ProjectId,
  daLayerSinceTimestamp: number,
): Promise<TimestampDaIndexedConfig[]> {
  const daLayerProject = await ps.getProject({
    id: daLayerProjectId,
    select: ['daLayer'],
  })

  if (
    !daLayerProject ||
    !daLayerProject.daLayer.sovereignProjectsTrackingConfig
  ) {
    return []
  }

  const indexedConfigs: TimestampDaIndexedConfig[] = []

  for (const sovereignProjectConfig of daLayerProject.daLayer
    .sovereignProjectsTrackingConfig) {
    const trackingConfigs = sovereignProjectConfig.daTrackingConfig
      .filter((c) => c.type === 'eigen-da')
      .map((c) => {
        const sinceTimestamp = Math.max(daLayerSinceTimestamp, c.sinceTimestamp)

        const withDaLayer = {
          daLayer: daLayerProjectId,
          ...c,
        }

        return {
          ...withDaLayer,
          configurationId: createDaTrackingId(withDaLayer),
          projectId: sovereignProjectConfig.projectId,
          sinceTimestamp,
        }
      })

    indexedConfigs.push(...trackingConfigs)
  }

  return indexedConfigs
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
      input.push(...config.appIds.sort((a, b) => a.localeCompare(b)))
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
