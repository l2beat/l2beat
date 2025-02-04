import type { Logger } from '@l2beat/backend-tools'
import type { EthereumDaTrackingConfig } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { DataAvailabilityDependencies } from './DataAvailabilityDependencies'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { LayerDaIndexer } from './indexers/ethereum/LayerDaIndexer'
import { ProjectDaIndexer } from './indexers/ethereum/ProjectDaIndexer'
import type { DataAvailabilityIndexer } from './indexers/types'
import {
  getDaLayerConfigHash,
  getDaProjectsConfigHash,
} from './utils/createDaConfigHash'

export function initDataAvailabilityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
): ApplicationModule | undefined {
  if (!config.da) {
    logger.info('Data availability module disabled')
    return
  }

  logger = logger.tag({
    feature: 'data-availability',
    module: 'data-availability',
  })

  const dependencies = new DataAvailabilityDependencies(
    config.da,
    database,
    providers,
  )

  const indexers = createIndexers(logger, clock, dependencies)

  return {
    start: async () => {
      logger.info('Starting data availability indexers')
      await Promise.all(
        indexers.map(async (indexer) => {
          logger.info(`Starting ${indexer.constructor.name}`)
          await indexer.start()
        }),
      )
      logger.info('Data availability indexers started')
    },
  }
}

function createIndexers(
  logger: Logger,
  clock: Clock,
  dependencies: DataAvailabilityDependencies,
): DataAvailabilityIndexer[] {
  const indexerService = new IndexerService(dependencies.database)

  const indexers: DataAvailabilityIndexer[] =
    dependencies.config.layers.flatMap((layer) => {
      // More layers go here
      if (layer === 'ethereum') {
        const blockTimestampProvider =
          dependencies.providers.block.getBlockTimestampProvider(layer)

        const blockProvider =
          dependencies.providers.block.getBlockProvider(layer)

        const daProvider = dependencies.providers
          .getDaProviders()
          .getDaProvider(layer)

        const blockTargetIndexer = new BlockTargetIndexer(
          logger,
          clock,
          blockTimestampProvider,
          ProjectId(layer),
        )

        const projectConfigs = dependencies.config.projects.filter(
          ({ config }) => config.type === layer,
        ) as {
          id: ProjectId
          config: EthereumDaTrackingConfig
        }[]

        const layerConfigHash = getDaLayerConfigHash(
          dependencies.config.ethereum.minHeight,
          layer,
        )

        // Min height should come from layer config and work somehow together with project settings
        const projectsConfigHash = getDaProjectsConfigHash(
          dependencies.config.ethereum.minHeight,
          projectConfigs.map(({ config }) => config),
        )

        const layerIndexer = new LayerDaIndexer({
          name: `da_layer_indexer_${layer}`,
          logger,
          indexerService,
          projectId: ProjectId(layer),
          db: dependencies.database,
          daProvider,
          blockProvider,
          parents: [blockTargetIndexer],
          batchSize: dependencies.config.ethereum.batchSize,
          minHeight: dependencies.config.ethereum.minHeight,
          configHash: layerConfigHash,
        })

        // We use one indexer for all projects for now
        // ideally each project should have its own indexer
        // with its own config and hash
        const projectIndexer = new ProjectDaIndexer({
          name: `da_project_indexer_${layer}`,
          logger,
          indexerService,
          projectConfigs,
          daProvider,
          blockProvider,
          db: dependencies.database,
          batchSize: dependencies.config.ethereum.batchSize,
          minHeight: dependencies.config.ethereum.minHeight,
          parents: [blockTargetIndexer],
          configHash: projectsConfigHash,
        })

        return [blockTargetIndexer, layerIndexer, projectIndexer]
      }

      return []
    })

  return indexers
}
