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

  const bigQueryClient = new BigQueryClient({
    clientEmail: config.liveness.bigQuery.clientEmail,
    privateKey: config.liveness.bigQuery.privateKey,
    projectId: config.liveness.bigQuery.projectId,
  })
  const livenessClient = new LivenessClient(bigQueryClient)

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const liveness = new LivenessIndexer(
    logger,
    hourlyIndexer,
    config.projects,
    livenessClient,
    indexerStateRepository,
    livenessRepository,
    livenessConfigurationRepository,
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
    await hourlyIndexer.start()
    await liveness.start()
  }

  return {
    start,
    routers: [livenessRouter],
  }
}
