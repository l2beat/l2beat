import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { LivenessRepository } from '../liveness/repositories/LivenessRepository'
import { FinalityController } from './api/FinalityController'
import { createFinalityRouter } from './api/FinalityRouter'

export function createFinalityModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.finality) {
    logger.info('Finality module disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessRepository = new LivenessRepository(database, logger)

  const finalityController = new FinalityController(
    livenessRepository,
    indexerStateRepository,
    config.projects,
    clock,
  )
  const finalityRouter = createFinalityRouter(finalityController)

  const start = () => {
    logger = logger.for('FinalityModule')
    logger.info('Starting...')
  }

  return {
    start,
    routers: [finalityRouter],
  }
}
