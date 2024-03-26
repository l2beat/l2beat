import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { ViemRpcClient } from '../../../../peripherals/viem-rpc-client/ViemRpcClient'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { PriceRepository } from '../../../tvl/repositories/PriceRepository'
import { TrackedTxsConfigsRepository } from '../../repositories/TrackedTxsConfigsRepository'
import { L2CostsController } from './api/L2CostsController'
import { createL2CostsRouter } from './api/L2CostsRouter'
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

  const l2CostsController = new L2CostsController(
    peripherals.getRepository(L2CostsRepository),
    peripherals.getRepository(TrackedTxsConfigsRepository),
    peripherals.getRepository(PriceRepository),
    config.projects,
    logger,
  )
  const l2CostsRouter = createL2CostsRouter(l2CostsController)

  const l2CostsUpdater = new L2CostsUpdater(
    peripherals.getRepository(L2CostsRepository),
    peripherals.getClient(ViemRpcClient, {
      url: config.trackedTxsConfig.uses.l2costs.ethereumProviderUrl,
      callsPerMinute:
        config.trackedTxsConfig.uses.l2costs.ethereumProviderCallsPerMinute,
    }),
    logger,
  )

  const start = () => {
    logger = logger.for('L2CostsModule')
    logger.info('Starting...')
  }

  return {
    start,
    routers: [l2CostsRouter],
    updater: l2CostsUpdater,
  }
}
