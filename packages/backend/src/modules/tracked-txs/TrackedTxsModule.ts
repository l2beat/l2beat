import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import { ApplicationModuleWithIndexer } from '../ApplicationModule'
import { LivenessUpdater } from '../liveness/LivenessUpdater'
import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsConfigsRepository } from './repositories/TrackedTxsConfigsRepository'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'

export function createTrackedTxsModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
  livenessUpdater: LivenessUpdater | undefined,
): ApplicationModuleWithIndexer<TrackedTxsIndexer> | undefined {
  if (!config.trackedTxsConfig || !livenessUpdater) {
    logger.info('TrackedTxsModule disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const trackedTxsConfigsRepository = new TrackedTxsConfigsRepository(
    database,
    logger,
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const bigQueryClient = new BigQueryClient(
    {
      clientEmail: config.trackedTxsConfig.bigQuery.clientEmail,
      privateKey: config.trackedTxsConfig.bigQuery.privateKey,
      projectId: config.trackedTxsConfig.bigQuery.projectId,
    },
    config.trackedTxsConfig.bigQuery.queryLimitGb,
    config.trackedTxsConfig.bigQuery.queryWarningLimitGb,
    logger,
  )

  const trackedTxsClient = new TrackedTxsClient(bigQueryClient)

  const runtimeConfigurations = config.projects
    .flatMap((project) => project.trackedTxsConfig?.entries)
    .filter(notUndefined)

  const updaters = {
    liveness: livenessUpdater,
  }

  const trackedTxsIndexer = new TrackedTxsIndexer(
    logger,
    hourlyIndexer,
    trackedTxsClient,
    indexerStateRepository,
    trackedTxsConfigsRepository,
    runtimeConfigurations,
    updaters,
    config.trackedTxsConfig.minTimestamp,
  )

  const start = async () => {
    logger = logger.for('TrackedTxsModule')
    logger.info('Starting...')

    await hourlyIndexer.start()
    await trackedTxsIndexer.start()
  }

  return {
    start,
    routers: [],
    indexer: trackedTxsIndexer,
  }
}
