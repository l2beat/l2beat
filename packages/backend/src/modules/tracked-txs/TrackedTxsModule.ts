import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'
import { TrackedTxsClient } from './utils/TrackedTxsClient'

export function createTrackedTransactionsModule(
  config: Config,
  logger: Logger,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.trackedTxsConfig) {
    logger.info('Tracked transactions module disabled')
    return
  }

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

  const trackedTxsIndexer = new TrackedTxsIndexer(
    logger,
    hourlyIndexer,
    runtimeConfigurations,
    trackedTxsClient,
    [],
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
