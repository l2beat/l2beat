import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import type {
  DataAvailabilityTrackingConfig,
  DataAvailabilityTrackingConfig2,
} from '../../config/Config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DaIndexer } from './indexers/DaIndexer'
import { DaIndexer2 } from './indexers/DaIndexer2'
import { DaService } from './services/DaService'
import { DaService2 } from './services/DaService2'

export function initDataAvailabilityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
  _peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.da || !config.da2) {
    logger.info('Data availability module disabled')
    return
  }

  logger = logger.tag({
    feature: 'data-availability',
    module: 'data-availability',
  })

  const { targetIndexers, daIndexers } = createIndexers(
    config.da,
    config.da2,
    clock,
    database,
    logger,
    providers,
  )

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

function createIndexers(
  config: DataAvailabilityTrackingConfig,
  config2: DataAvailabilityTrackingConfig2,
  clock: Clock,
  database: Database,
  logger: Logger,
  providers: Providers,
) {
  const daService = new DaService()
  const daService2 = new DaService2()
  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: (DaIndexer | DaIndexer2)[] = []

  for (const daLayer of config.layers) {
    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      providers.blockTimestamp,
      daLayer.name,
    )
    targetIndexers.push(targetIndexer)

    const configurations = config.projects.filter(
      (c) => c.config.daLayer === daLayer.name,
    )

    const indexer = new DaIndexer({
      configurations: configurations.map((c) => ({
        id: c.configurationId,
        minHeight: c.config.sinceBlock,
        maxHeight: c.config.untilBlock ?? null,
        properties: c.config,
      })),
      daProvider: providers.da,
      daService,
      logger,
      daLayer: daLayer.name,
      batchSize: daLayer.batchSize,
      parents: [targetIndexer],
      indexerService,
      db: database,
    })

    const configurations2 = config2.projects.filter(
      (c) => c.daLayer === daLayer.name,
    )

    daIndexers.push(indexer)

    const indexer2 = new DaIndexer2({
      configurations: configurations2.map((c) => ({
        id: c.configurationId,
        minHeight: c.sinceBlock,
        maxHeight: c.untilBlock ?? null,
        properties: c,
      })),
      daProvider: providers.da,
      daService: daService2,
      logger,
      daLayer: daLayer.name,
      batchSize: daLayer.batchSize,
      parents: [targetIndexer],
      indexerService,
      db: database,
    })

    daIndexers.push(indexer2)
  }

  return { targetIndexers, daIndexers }
}
