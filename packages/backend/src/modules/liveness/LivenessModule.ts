import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../tools/Clock'
import { ApplicationModuleWithUpdater } from '../ApplicationModule'
import { LivenessController } from './api/LivenessController'
import { createLivenessRouter } from './api/LivenessRouter'
import { LivenessUpdater } from './LivenessUpdater'
import { LivenessRepository } from './repositories/LivenessRepository'

export function createLivenessModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModuleWithUpdater<LivenessUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.liveness) {
    logger.info('Liveness module disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessRepository = new LivenessRepository(database, logger)
  const livenessUpdater = new LivenessUpdater(livenessRepository, logger)

  const livenessController = new LivenessController(
    livenessRepository,
    livenessConfigurationRepository,
    indexerStateRepository,
    config.projects,
    clock,
    logger,
  )

  const livenessRouter = createLivenessRouter(livenessController, config)

  const start = () => {
    logger = logger.for('LivenessModule')
    logger.info('Starting...')

    if (config.api.cache.liveness) {
      livenessController.start()
    }
  }

  return {
    start,
    routers: [livenessRouter],
    updater: livenessUpdater,
  }
}
