import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { LivenessController } from './api/LivenessController'
import { createLivenessRouter } from './api/LivenessRouter'
import { LivenessStatusController } from './api/LivenessStatusController'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { LivenessIndexer } from './LivenessIndexer'
import { LivenessConfigurationRepository } from './repositories/LivenessConfigurationRepository'
import { LivenessRepository } from './repositories/LivenessRepository'

export function createLivenessModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.liveness) {
    logger.info('Liveness module disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessRepository = new LivenessRepository(database, logger)
  const livenessConfigurationRepository = new LivenessConfigurationRepository(
    database,
    logger,
  )

  const bigQueryClient = new BigQueryClient(
    {
      clientEmail: config.liveness.bigQuery.clientEmail,
      privateKey: config.liveness.bigQuery.privateKey,
      projectId: config.liveness.bigQuery.projectId,
    },
    config.liveness.bigQuery.queryLimitGb,
    config.liveness.bigQuery.queryWarningLimitGb,
    logger,
  )
  const livenessClient = new LivenessClient(bigQueryClient)

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const runtimeConfigurations = config.projects.flatMap(
    (project) => project.livenessConfig?.entries ?? [],
  )
  const liveness = new LivenessIndexer(
    logger,
    hourlyIndexer,
    livenessClient,
    indexerStateRepository,
    livenessRepository,
    livenessConfigurationRepository,
    runtimeConfigurations,
    config.liveness.minTimestamp,
  )

  const livenessController = new LivenessController(
    livenessRepository,
    indexerStateRepository,
    config.projects,
    clock,
    logger,
  )

  const livenessStatusController = new LivenessStatusController(
    clock,
    indexerStateRepository,
    livenessConfigurationRepository,
  )

  const livenessRouter = createLivenessRouter(
    livenessController,
    livenessStatusController,
    config,
  )

  const start = async () => {
    logger = logger.for('LivenessModule')
    logger.info('Starting...')

    if (config.api.cache.liveness) {
      livenessController.start()
    }

    await hourlyIndexer.start()
    await liveness.start()
  }

  return {
    start,
    routers: [livenessRouter],
    indexer: liveness,
  }
}
