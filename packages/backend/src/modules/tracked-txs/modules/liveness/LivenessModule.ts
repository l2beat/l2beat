import type { Logger } from '@l2beat/backend-tools'

import type { Config } from '../../../../config'
import type { Peripherals } from '../../../../peripherals/Peripherals'
import type { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { LivenessUpdater } from './LivenessUpdater'

export function createLivenessModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModuleWithUpdater<LivenessUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.liveness) {
    logger.info('Liveness module disabled')
    return
  }

  logger = logger.tag({ feature: 'liveness', module: 'liveness' })

  const livenessUpdater = new LivenessUpdater(peripherals.database, logger)

  return {
    updater: livenessUpdater,
  }
}
