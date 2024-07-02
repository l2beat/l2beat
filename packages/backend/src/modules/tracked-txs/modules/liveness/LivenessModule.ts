import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { Clock } from '../../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../../tools/uif/IndexerStateRepository'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { LivenessUpdater } from './LivenessUpdater'
import { LivenessController } from './api/LivenessController'
import { createLivenessRouter } from './api/LivenessRouter'
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

  const indexerStateRepository = peripherals.getRepository(
    IndexerStateRepository,
  )
  const configurationsRepository = peripherals.getRepository(
    IndexerConfigurationRepository,
  )
  const indexerService = new IndexerService(
    indexerStateRepository,
    configurationsRepository,
  )

  const livenessController = new LivenessController({
    clock,
    indexerService,
    projects: config.projects,
    logger,
    livenessRepository: peripherals.getRepository(LivenessRepository),
  })

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
