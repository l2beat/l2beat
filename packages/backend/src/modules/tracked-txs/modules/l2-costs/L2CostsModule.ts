import type { ApplicationModule, ModuleDependencies } from '../../../types'
import { L2CostsUpdater } from './L2CostsUpdater'

export function createL2CostsModule({
  config,
  logger,
  peripherals,
}: ModuleDependencies):
  | (ApplicationModule & { updater: L2CostsUpdater })
  | undefined {
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
