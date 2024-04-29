import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Peripherals } from '../../peripherals/Peripherals'
import { Clock } from '../../tools/Clock'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import {
  ApplicationModule,
  ApplicationModuleWithIndexer,
} from '../ApplicationModule'
import { createTrackedTxsStatusRouter } from './api/TrackedTxsStatusRouter'
import { HourlyIndexer } from './HourlyIndexer'
import { L2CostsAggregatorIndexer } from './modules/l2-costs/L2CostsAggregator'
import { createL2CostsModule } from './modules/l2-costs/L2CostsModule'
import { AggregatedL2CostsRepository } from './modules/l2-costs/repositories/AggregatedL2CostsRepository'
import { L2CostsRepository } from './modules/l2-costs/repositories/L2CostsRepository'
import { createLivenessModule } from './modules/liveness/LivenessModule'
import { TrackedTxsConfigsRepository } from './repositories/TrackedTxsConfigsRepository'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'

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

  const hourlyIndexer = new HourlyIndexer(logger, clock)
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

  const l2CostsAggregatorIndexer = new L2CostsAggregatorIndexer({
    l2CostsRepository: peripherals.getRepository(L2CostsRepository),
    aggregatedL2CostsRepository: peripherals.getRepository(
      AggregatedL2CostsRepository,
    ),
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
    await l2CostsAggregatorIndexer.start()
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
