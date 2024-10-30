import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient2,
  RetryHandler,
} from '@l2beat/shared'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import {
  ApplicationModule,
  ApplicationModuleWithIndexer,
} from '../ApplicationModule'
import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import { createL2CostsModule } from './modules/l2-costs/L2CostsModule'
import { L2CostsAggregatorIndexer } from './modules/l2-costs/indexers/L2CostsAggregatorIndexer'
import { L2CostsPricesIndexer } from './modules/l2-costs/indexers/L2CostsPricesIndexer'
import { createLivenessModule } from './modules/liveness/LivenessModule'
import { AnomaliesIndexer } from './modules/liveness/indexers/AnomaliesIndexer'
import { LivenessAggregatingIndexer } from './modules/liveness/indexers/LivenessAggregatingIndexer'

export function createTrackedTxsModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModuleWithIndexer<TrackedTxsIndexer> | undefined {
  if (!config.trackedTxsConfig) {
    logger.info('TrackedTxsModule disabled')
    return
  }

  const indexerService = new IndexerService(peripherals.database)

  const hourlyIndexer = new HourlyIndexer(logger, clock, 'tracked-txs')
  const bigQueryClient = peripherals.getClient(
    BigQueryClient,
    config.trackedTxsConfig.bigQuery,
  )

  const trackedTxsClient = new TrackedTxsClient(bigQueryClient)

  const runtimeConfigurations = config.projects
    .flatMap((project) => project.trackedTxsConfig)
    .filter(notUndefined)

  const livenessModule = createLivenessModule(config, logger, peripherals)
  const l2costsModule = createL2CostsModule(config, logger, peripherals)

  const subModules: (ApplicationModule | undefined)[] = [
    livenessModule,
    l2costsModule,
  ]

  const updaters = [livenessModule?.updater, l2costsModule?.updater].filter(
    notUndefined,
  )

  const minTimestamp = config.trackedTxsConfig.minTimestamp.toNumber()

  const trackedTxsIndexer = new TrackedTxsIndexer({
    logger,
    parents: [hourlyIndexer],
    indexerService,
    trackedTxsClient,
    configurations: runtimeConfigurations.map((c) => ({
      properties: c,
      minHeight:
        c.sinceTimestamp.toNumber() < minTimestamp
          ? minTimestamp
          : c.sinceTimestamp.toNumber(),
      maxHeight: c.untilTimestamp?.toNumber() ?? null,
      id: c.id,
    })),
    updaters,
    db: peripherals.database,
    serializeConfiguration: (config) => JSON.stringify(config),
  })

  let l2CostPricesIndexer: L2CostsPricesIndexer | undefined
  let l2CostsAggregatorIndexer: L2CostsAggregatorIndexer | undefined

  if (
    config.trackedTxsConfig.uses.l2costs &&
    config.trackedTxsConfig.uses.l2costs.aggregatorEnabled
  ) {
    const coingeckoClient = new CoingeckoClient(
      new HttpClient2(),
      config.coingeckoApiKey,
      RetryHandler.RELIABLE_API(logger),
    )

    const coingeckoQueryService = new CoingeckoQueryService(
      coingeckoClient,
      logger.tag('trackedTxs'),
    )

    l2CostPricesIndexer = new L2CostsPricesIndexer({
      coingeckoQueryService,
      db: peripherals.database,
      parents: [hourlyIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
      logger,
    })

    l2CostsAggregatorIndexer = new L2CostsAggregatorIndexer({
      db: peripherals.database,
      parents: [trackedTxsIndexer, l2CostPricesIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
      logger,
      projects: config.projects,
    })
  }

  let livenessAggregatingIndexer: LivenessAggregatingIndexer | undefined
  let anomaliesIndexer: AnomaliesIndexer | undefined

  if (config.trackedTxsConfig.uses.liveness) {
    livenessAggregatingIndexer = new LivenessAggregatingIndexer({
      db: peripherals.database,
      projects: config.projects,
      parents: [trackedTxsIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
      logger,
    })

    anomaliesIndexer = new AnomaliesIndexer({
      db: peripherals.database,
      projects: config.projects,
      parents: [trackedTxsIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
      logger,
    })
  }

  const start = async () => {
    logger = logger.for('TrackedTxsModule')
    logger.info('Starting...')

    await hourlyIndexer.start()
    for (const subModule of subModules) {
      await subModule?.start?.()
    }
    await trackedTxsIndexer.start()
    await l2CostPricesIndexer?.start()
    await l2CostsAggregatorIndexer?.start()
    await livenessAggregatingIndexer?.start()
    await anomaliesIndexer?.start()
  }

  return {
    start,
    indexer: trackedTxsIndexer,
  }
}
