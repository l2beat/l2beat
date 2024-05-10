import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { ViemRpcClient } from '../../../../peripherals/viem-rpc-client/ViemRpcClient'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { TrackedTxsConfigsRepository } from '../../repositories/TrackedTxsConfigsRepository'
import { L2CostsUpdater } from './L2CostsUpdater'
import { L2CostsController } from './api/L2CostsController'
import { createL2CostsRouter } from './api/L2CostsRouter'
import { L2CostsRepository } from './repositories/L2CostsRepository'
import { AggregatedL2CostsRepository } from './repositories/AggregatedL2CostsRepository'

export function createL2CostsModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModuleWithUpdater<L2CostsUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.l2costs) {
    logger.info('L2Costs module disabled')
    return
  }

  const l2CostsController = new L2CostsController({
    trackedTxsConfigsRepository: peripherals.getRepository(
      TrackedTxsConfigsRepository,
    ),
    aggregatedL2CostsRepository: peripherals.getRepository(
      AggregatedL2CostsRepository,
    ),
    projects: config.projects,
    logger,
  })

  const l2CostsRouter = createL2CostsRouter(l2CostsController, config.api)

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

    if (config.api.cache.l2costs) {
      l2CostsController.start()
    }
  }

  return {
    start,
    routers: [l2CostsRouter],
    updater: l2CostsUpdater,
  }
}
