import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
import { LivenessRepository } from '../liveness/repositories/LivenessRepository'
import { FinalityController } from './api/FinalityController'
import { createFinalityRouter } from './api/FinalityRouter'
import { FinalityIndexer } from './FinalityIndexer'
import { FinalityRepository } from './repositories/FinalityRepository'

export function createFinalityModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
  livenessIndexer?: LivenessIndexer,
): ApplicationModule | undefined {
  if (!config.finality || !livenessIndexer) {
    logger.info('Finality module disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessRepository = new LivenessRepository(database, logger)
  const finalityRepository = new FinalityRepository(database, logger)

  const finalityController = new FinalityController(
    livenessRepository,
    indexerStateRepository,
    config.projects,
    clock,
  )
  const finalityRouter = createFinalityRouter(finalityController)

  const finalityIndexer = new FinalityIndexer(
    logger,
    livenessIndexer,
    indexerStateRepository,
    finalityRepository,
    [],
  )

  const start = async () => {
    logger = logger.for('FinalityModule')
    logger.info('Starting...')

    await finalityIndexer.start()
  }

  return {
    start,
    routers: [finalityRouter],
  }
}
