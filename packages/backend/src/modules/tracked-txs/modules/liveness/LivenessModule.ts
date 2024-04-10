import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { Clock } from '../../../../tools/Clock'
import { IndexerStateRepository } from '../../../../tools/uif/IndexerStateRepository'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { TrackedTxsConfigsRepository } from '../../repositories/TrackedTxsConfigsRepository'
import { LivenessController } from './api/LivenessController'
import { createLivenessRouter } from './api/LivenessRouter'
import { LivenessUpdater } from './LivenessUpdater'
import { LivenessRepository } from './repositories/LivenessRepository'

export function createLivenessModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModuleWithUpdater<LivenessUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.liveness) {
    logger.info('Liveness module disabled')
    return
  }

  const livenessUpdater = new LivenessUpdater(
    peripherals.getRepository(LivenessRepository),
    logger,
  )

  const livenessController = new LivenessController(
    peripherals.getRepository(LivenessRepository),
    peripherals.getRepository(TrackedTxsConfigsRepository),
    peripherals.getRepository(IndexerStateRepository),
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
