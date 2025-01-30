import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { HttpClient } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { DataAvailabilityTrackingConfig } from '../../config/Config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockTargetIndexer } from '../activity/indexers/BlockTargetIndexer'
import { DataAvailabilityDependencies } from './DataAvailabilityDependencies'
import { BlobScanClient } from './clients/BlobscanClient'
import { EthereumDaIndexer } from './indexers/EthereumDaIndexer'
import type { DataAvailabilityIndexer } from './indexers/types'
import { BlobScanDaProvider } from './providers/BlobscanDaProvider'

export function initDataAvailabilityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
  _peripherals: Peripherals,
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
    config,
    database,
    providers,
  )

  const indexers = createDaLayerIndexers(
    config.da,
    providers,
    logger,
    clock,
    dependencies,
  )

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

function createDaLayerIndexers(
  config: DataAvailabilityTrackingConfig,
  providers: Providers,
  logger: Logger,
  clock: Clock,
  dependencies: DataAvailabilityDependencies,
): DataAvailabilityIndexer[] {
  const indexerService = new IndexerService(dependencies.database)

  const indexers: DataAvailabilityIndexer[] = config.layers.flatMap((layer) => {
    if (layer === 'ethereum') {
      const blockTimestampProvider =
        providers.block.timestampProviders.get(layer)

      const blockProvider = providers.block.blockProviders.get(layer)

      const httpClient = new HttpClient()

      const blobscanClient = new BlobScanClient({
        baseUrl: 'https://api.blobscan.com/',
        http: httpClient,
        logger,
        sourceName: 'blobscan',
        callsPerMinute: 300,
        timeout: 30_000,
        retryStrategy: 'UNRELIABLE',
      })

      const blobsProvider = new BlobScanDaProvider(blobscanClient)

      if (!blockTimestampProvider || !blockProvider) {
        throw new Error(
          `Block timestamp or block provider for ${layer} not found`,
        )
      }

      const blockTargetIndexer = new BlockTargetIndexer(
        logger,
        clock,
        blockTimestampProvider,
        ProjectId(layer),
      )

      const indexer = new EthereumDaIndexer({
        parents: [blockTargetIndexer],
        indexerService,
        logger,
        batchSize: 2500,
        selector: layer,
        blobsProvider: blobsProvider,
        blockProvider: blockProvider,
        db: dependencies.database,
        minHeight: 19426618, // duncan
      })
      return [blockTargetIndexer, indexer]
    }

    return []
  })

  return indexers
}
