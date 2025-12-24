import { assert } from '@l2beat/shared-pure'
import type { ApplicationModule, ModuleDependencies } from '../../../types'
import { L2CostsUpdater } from './L2CostsUpdater'

export function createL2CostsModule({
  config,
  logger,
  db,
  providers,
}: ModuleDependencies):
  | (ApplicationModule & { updater: L2CostsUpdater })
  | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.l2costs) {
    logger.info('L2Costs module disabled')
    return
  }

  logger = logger.tag({ feature: 'costs', module: 'costs' })

  assert(providers.blobPrice, 'Blob price provider is required')
  const l2CostsUpdater = new L2CostsUpdater(db, logger, providers.blobPrice)

  return {
    updater: l2CostsUpdater,
  }
}
