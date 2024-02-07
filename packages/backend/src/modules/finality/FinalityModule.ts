import { Logger } from '@l2beat/backend-tools'

import { FinalityController } from '../../api/controllers/finality/FinalityController'
import { createFinalityRouter } from '../../api/routers/FinalityRouter'
import { Config } from '../../config'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { LivenessRepository } from '../liveness/repositories/LivenessRepository'

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
