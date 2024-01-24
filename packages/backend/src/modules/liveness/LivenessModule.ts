import { Logger } from '@l2beat/backend-tools'

import { LivenessController } from '../../api/controllers/liveness/LivenessController'
import { createLivenessRouter } from '../../api/routers/LivenessRouter'
import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { HourlyIndexer } from '../../core/liveness/HourlyIndexer'
import { LivenessClient } from '../../core/liveness/LivenessClient'
import { LivenessIndexer } from '../../core/liveness/LivenessIndexer'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { LivenessConfigurationRepository } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'

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
  )
  const livenessRouter = createLivenessRouter(livenessController)

  const start = async () => {
    logger = logger.for('LivenessModule')
    logger.info('Starting...')

    await hourlyIndexer.start()
    await liveness.start()
  }

  return {
    start,
    routers: [livenessRouter],
  }
}
