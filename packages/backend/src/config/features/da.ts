import type { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import { createDaTrackingId } from '@l2beat/shared'
import { notUndefined, ProjectId } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  BlockDaIndexedConfig,
  BlockLayerDaTrackingConfig,
  DataAvailabilityTrackingConfig,
} from '../Config'

const ETHEREUM_START_BLOCK = 19426618

export async function getDaTrackingConfig(
  ps: ProjectService,
  env: Env,
): Promise<DataAvailabilityTrackingConfig> {
  const ethereumEnabled = !!env.optionalString('ETHEREUM_BEACON_API_URL')

  const blockLayers: BlockLayerDaTrackingConfig[] = []
  // This is needed for MultiIndexer so we treat layer as project
  const blockProjectsForLayers: BlockDaIndexedConfig[] = []
  const sovereignBlockProjects: BlockDaIndexedConfig[] = []

  if (ethereumEnabled) {
    blockLayers.push({
      type: 'ethereum' as const,
      name: 'ethereum',
      url: env.string('ETHEREUM_BEACON_API_URL'),
      callsPerMinute: env.integer('ETHEREUM_BEACON_API_CALLS_PER_MINUTE', 600),
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
        ETHEREUM_START_BLOCK,
      )
    sovereignBlockProjects.push(...sovereignProjectsOnEthereum)
  }

  const blockProjects = await getBlockDaTrackingProjects(ps, blockLayers)

  return {
    blockLayers,
    blockProjects: [
      ...blockProjectsForLayers,
      ...blockProjects,
      ...sovereignBlockProjects,
    ],
  }
}

async function getBlockDaTrackingProjects(
  ps: ProjectService,
  enabledLayers: BlockLayerDaTrackingConfig[],
): Promise<BlockDaIndexedConfig[]> {
  const projects = await ps.getProjects({
    select: ['daTrackingConfig'],
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

async function getBlockDaTrackingSovereignProjects(
  ps: ProjectService,
  daLayerProjectId: ProjectId,
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
    const trackingConfigs = sovereignProjectConfig.daTrackingConfig.map((c) => {
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

function createDaLayerConfigId(daLayerName: string): string {
  const input = []
  input.push(daLayerName)
  // we're running two versions of DA in parallel to rollout new features
  input.push('v2')

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
