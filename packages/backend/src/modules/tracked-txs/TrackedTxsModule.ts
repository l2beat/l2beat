import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import { CoingeckoClient, CoingeckoQueryService } from '@l2beat/shared'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Clock } from '../../tools/Clock'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import {
  ApplicationModule,
  ApplicationModuleWithIndexer,
} from '../ApplicationModule'
import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import { createTrackedTxsStatusRouter } from './api/TrackedTxsStatusRouter'
import { createL2CostsModule } from './modules/l2-costs/L2CostsModule'
import { L2CostsAggregatorIndexer } from './modules/l2-costs/indexers/L2CostsAggregatorIndexer'
import { L2CostsPricesIndexer } from './modules/l2-costs/indexers/L2CostsPricesIndexer'
import { AggregatedL2CostsRepository } from './modules/l2-costs/repositories/AggregatedL2CostsRepository'
import { L2CostsPricesRepository } from './modules/l2-costs/repositories/L2CostsPricesRepository'
import { L2CostsRepository } from './modules/l2-costs/repositories/L2CostsRepository'
import { createLivenessModule } from './modules/liveness/LivenessModule'
import { TrackedTxsConfigsRepository } from './repositories/TrackedTxsConfigsRepository'
import { LivenessAggregatingIndexer } from './modules/liveness/indexers/LivenessAggregatingIndexer'
import { LivenessRepository } from './modules/liveness/repositories/LivenessRepository'
import { AggregatedLivenessRepository } from './modules/liveness/repositories/AggregatedLivenessRepository'

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

  const indexerService = new IndexerService(
    peripherals.getRepository(IndexerStateRepository),
    peripherals.getRepository(IndexerConfigurationRepository),
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock, 'tracked-txs')
  const bigQueryClient = peripherals.getClient(
    BigQueryClient,
    config.trackedTxsConfig.bigQuery,
  )

  const trackedTxsClient = new TrackedTxsClient(bigQueryClient)

  const runtimeConfigurations = config.projects
    .flatMap((project) => project.trackedTxsConfig?.entries)
    .filter(notUndefined)

  const livenessModule = createLivenessModule(
    config,
    logger,
    peripherals,
    clock,
  )
  const l2costsModule = createL2CostsModule(config, logger, peripherals)

  const subModules: (ApplicationModule | undefined)[] = [
    livenessModule,
    l2costsModule,
  ]

  const updaters = {
    liveness: livenessModule?.updater,
    l2costs: l2costsModule?.updater,
  }

  const trackedTxsConfigsRepository = peripherals.getRepository(
    TrackedTxsConfigsRepository,
  )

  const trackedTxsIndexer = new TrackedTxsIndexer(
    logger,
    hourlyIndexer,
    updaters,
    trackedTxsClient,
    peripherals.getRepository(IndexerStateRepository),
    trackedTxsConfigsRepository,
    runtimeConfigurations,
    config.trackedTxsConfig.minTimestamp,
  )

  let l2CostPricesIndexer: L2CostsPricesIndexer | undefined
  let l2CostsAggregatorIndexer: L2CostsAggregatorIndexer | undefined

  if (
    config.trackedTxsConfig.uses.l2costs &&
    config.trackedTxsConfig.uses.l2costs.aggregatorEnabled
  ) {
    const coingeckoClient = peripherals.getClient(CoingeckoClient, {
      apiKey: config.trackedTxsConfig.uses.l2costs.coingeckoApiKey,
    })

    const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

    l2CostPricesIndexer = new L2CostsPricesIndexer({
      coingeckoQueryService,
      l2CostsPricesRepository: peripherals.getRepository(
        L2CostsPricesRepository,
      ),
      parents: [hourlyIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
      logger,
    })

    l2CostsAggregatorIndexer = new L2CostsAggregatorIndexer({
      l2CostsRepository: peripherals.getRepository(L2CostsRepository),
      aggregatedL2CostsRepository: peripherals.getRepository(
        AggregatedL2CostsRepository,
      ),
      l2CostsPricesRepository: peripherals.getRepository(
        L2CostsPricesRepository,
      ),
      parents: [trackedTxsIndexer, l2CostPricesIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
      logger,
      projects: config.projects,
    })
  }

  const livenessAggregatingIndexer = new LivenessAggregatingIndexer({
    livenessRepository: peripherals.getRepository(LivenessRepository),
    aggregatedLivenessRepository: peripherals.getRepository(
      AggregatedLivenessRepository,
    ),
    projects: config.projects,
    parents: [trackedTxsIndexer],
    indexerService,
    minHeight: config.trackedTxsConfig.minTimestamp.toNumber(),
    logger,
  })

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
    await livenessAggregatingIndexer.start()
  }

  return {
    start,
    routers: [
      ...subModules.flatMap((m) => m?.routers ?? []),
      createTrackedTxsStatusRouter({
        clock,
        trackedTxsConfigsRepository,
      }),
    ],
    indexer: trackedTxsIndexer,
  }
}
