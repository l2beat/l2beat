import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import type { DataAvailabilityTrackingConfig } from '../../config/Config'
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

  const { targetIndexers, daIndexers } = createIndexers(
    config.da,
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
  clock: Clock,
  database: Database,
  logger: Logger,
  providers: Providers,
) {
  const daService2 = new DaService()
  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: DaIndexer[] = []

  for (const daLayer of config.layers) {
    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      providers.blockTimestamp,
      daLayer.name,
    )
    targetIndexers.push(targetIndexer)

    const configurations2 = config.projects.filter(
      (c) => c.daLayer === daLayer.name,
    )

    const indexer2 = new DaIndexer({
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
