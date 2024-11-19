import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { L2CostsUpdater } from './L2CostsUpdater'

export function createL2CostsModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModuleWithUpdater<L2CostsUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.l2costs) {
    logger.info('L2Costs module disabled')
    return
  }

  logger = logger.tag({ feature: 'costs', module: 'costs' })

  const l2CostsUpdater = new L2CostsUpdater(peripherals.database, logger)

  return {
    updater: l2CostsUpdater,
  }
}
