import { BigQuery } from '@google-cloud/bigquery'
import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import {
  ApplicationModule,
  ApplicationModuleWithIndexer,
} from '../ApplicationModule'
import { createL2CostsModule } from '../l2-costs/L2CostsModule'
import { HourlyIndexer } from './HourlyIndexer'
import { createLivenessModule } from './modules/liveness/LivenessModule'
import { TrackedTxsConfigsRepository } from './repositories/TrackedTxsConfigsRepository'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'

export function createTrackedTxsModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModuleWithIndexer<TrackedTxsIndexer> | undefined {
  if (!config.trackedTxsConfig) {
    logger.info('TrackedTxsModule disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const trackedTxsConfigsRepository = new TrackedTxsConfigsRepository(
    database,
    logger,
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const bigQuery = new BigQuery({
    credentials: {
      client_email: config.trackedTxsConfig.bigQuery.clientEmail,
      private_key: config.trackedTxsConfig.bigQuery.privateKey,
    },
    projectId: config.trackedTxsConfig.bigQuery.projectId,
  })
  const bigQueryClient = new BigQueryClient(bigQuery)

  const trackedTxsClient = new TrackedTxsClient(bigQueryClient)

  const runtimeConfigurations = config.projects
    .flatMap((project) => project.trackedTxsConfig?.entries)
    .filter(notUndefined)

  const livenessModule = createLivenessModule(config, logger, database, clock)
  const l2costsModule = createL2CostsModule(config, logger, database)

  const subModules: (ApplicationModule | undefined)[] = [
    livenessModule,
    l2costsModule,
  ]

  const updaters = {
    liveness: livenessModule?.updater,
    l2costs: l2costsModule?.updater,
  }

  const trackedTxsIndexer = new TrackedTxsIndexer(
    logger,
    hourlyIndexer,
    updaters,
    trackedTxsClient,
    indexerStateRepository,
    trackedTxsConfigsRepository,
    runtimeConfigurations,
    config.trackedTxsConfig.minTimestamp,
  )

  const start = async () => {
    logger = logger.for('TrackedTxsModule')
    logger.info('Starting...')

    await hourlyIndexer.start()
    for (const subModule of subModules) {
      await subModule?.start?.()
    }
    await trackedTxsIndexer.start()
  }

  return {
    start,
    routers: subModules.flatMap((m) => m?.routers ?? []),
    indexer: trackedTxsIndexer,
  }
}
