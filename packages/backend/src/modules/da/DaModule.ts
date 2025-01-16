import { Logger } from '@l2beat/backend-tools'
import { EthereumDaConfig, layer2s } from '@l2beat/config'
import { Database } from '@l2beat/database'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Providers } from '../../providers/Providers'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import { ApplicationModule } from '../ApplicationModule'
import { BlockTargetIndexer } from './BlockTargetIndexer'
import { BlobScanClient } from './clients/BlobscanClient'
import { EthereumDaIndexer } from './indexers/EthereumDaIndexer'
import { EthereumDaProjectIndexer } from './indexers/EthereumDaProjectIndexer'
import { BlobScanDaProvider } from './providers/BlobscanDaProvider'

export function initDaModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
  peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.da) {
    logger.info('Data availability module disabled')
    return
  }

  logger = logger.tag({
    feature: 'data-availability',
    module: 'data-availability',
  })

  const blockTimestampProvider =
    providers.block.getBlockTimestampProvider('ethereum')

  const blockTargetIndexer = new BlockTargetIndexer(
    logger,
    clock,
    blockTimestampProvider,
  )
  const blobscanClient = peripherals.getClient(BlobScanClient, {
    url: config.da.blobscan.url,
  })

  const blockProvider = providers.block.getBlockProvider('ethereum')

  const blobsProvider = new BlobScanDaProvider(blobscanClient)

  const indexerService = new IndexerService(database)

  const ethereumDaIndexer = new EthereumDaIndexer({
    logger,
    batchSize: 1000,
    minHeight: 21002704,
    parents: [blockTargetIndexer],
    blobsProvider: blobsProvider,
    blockProvider,
    db: database,
    indexerService,
  })

  const projectIndexers = layer2s
    .filter(
      (project) =>
        project.dataActivityConfig &&
        project.dataActivityConfig.type === 'Ethereum',
    )
    .map((project) => {
      return new EthereumDaProjectIndexer({
        projectId: project.id,
        config: project.dataActivityConfig as EthereumDaConfig,
        logger,
        batchSize: 10000,
        parents: [blockTargetIndexer],
        blobsProvider: blobsProvider,
        blockProvider,
        db: database,
        minHeight: 21002704,
        indexerService,
      })
    })

  const indexers = [blockTargetIndexer, ethereumDaIndexer, ...projectIndexers]

  return {
    start: async () => {
      logger.info('Starting data availability module')
      await Promise.all(
        indexers.map(async (indexer) => {
          logger.info(`Starting ${indexer.constructor.name}`)
          await indexer.start()
          logger.info(`Started ${indexer.constructor.name}`)
        }),
      )
      logger.info('Data availability module started')
    },
  }
}
