import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { ViemRpcClient } from '../../../../peripherals/viem-rpc-client/ViemRpcClient'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { L2CostsUpdater } from './L2CostsUpdater'
import { L2CostsRepository } from './repositories/L2CostsRepository'

export function createL2CostsModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModuleWithUpdater<L2CostsUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.l2costs) {
    logger.info('L2Costs module disabled')
    return
  }

  const l2CostsUpdater = new L2CostsUpdater(
    peripherals.getRepository(L2CostsRepository),
    peripherals.getClient(ViemRpcClient, {
      url: config.trackedTxsConfig.uses.l2costs.providerUrl,
      callsPerMinute:
        config.trackedTxsConfig.uses.l2costs.providerCallsPerMinute,
    }),
    logger,
  )

  const start = () => {
    logger = logger.for('L2CostsModule')
    logger.info('Starting...')
  }

  return {
    start,
    routers: [],
    updater: l2CostsUpdater,
  }
}
