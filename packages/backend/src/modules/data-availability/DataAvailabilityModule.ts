import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import type { DaTrackingConfig } from '../../config/Config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DaIndexer } from './indexers/DaIndexer'
import { DaService } from './services/DaService'

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

  const blockProviders = providers.block
  const daProviders = providers.getDaProviders()
  const daService = new DaService(config.da.projects.map((c) => c.config))

  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: DaIndexer[] = []

  for (const daLayer of config.da.layers) {
    const blockTimestampProvider = blockProviders.getBlockTimestampProvider(
      daLayer.name,
    )

    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      blockTimestampProvider,
      daLayer.name,
    )

    targetIndexers.push(targetIndexer)

    const daProvider = daProviders.getProvider(daLayer.name)

    const configurations = config.da.projects.filter(
      (c) => c.config.daLayer === daLayer.name,
    )

    const indexer = new DaIndexer({
      configurations: configurations.map((c) => ({
        id: c.configurationId,
        minHeight: c.config.sinceBlock,
        maxHeight: c.config.untilBlock ?? null,
        properties: c.config,
      })),
      daProvider,
      daService,
      logger,
      daLayer: daLayer.name,
      batchSize: daLayer.batchSize,
      parents: [targetIndexer],
      indexerService,
      db: database,
      serializeConfiguration: (value: DaTrackingConfig) =>
        JSON.stringify(value),
    })
    daIndexers.push(indexer)
  }

  return {
    start: async () => {
      logger.info('Starting target indexers')
      await Promise.all(
        targetIndexers.map(async (indexer) => {
          logger.info(
            `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
          )
          await indexer.start()
        }),
      )
      logger.info('Target indexers started')

      logger.info('Starting DA indexers')
      await Promise.all(
        daIndexers.map(async (indexer) => {
          logger.info(
            `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
          )
          await indexer.start()
        }),
      )
      logger.info('DA indexers started')
    },
  }
}
