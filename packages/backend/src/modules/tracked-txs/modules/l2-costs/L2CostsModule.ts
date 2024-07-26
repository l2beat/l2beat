import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { IndexerService } from '../../../../tools/uif/IndexerService'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { L2CostsUpdater } from './L2CostsUpdater'
import { L2CostsController } from './api/L2CostsController'
import { createL2CostsRouter } from './api/L2CostsRouter'

export function createL2CostsModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModuleWithUpdater<L2CostsUpdater> | undefined {
  if (!config.trackedTxsConfig || !config.trackedTxsConfig.uses.l2costs) {
    logger.info('L2Costs module disabled')
    return
  }

  const indexerService = new IndexerService(peripherals.database)

  const l2CostsController = new L2CostsController({
    indexerService,
    db: peripherals.database,
    projects: config.projects,
    logger,
  })

  const l2CostsRouter = createL2CostsRouter(l2CostsController)

  const l2CostsUpdater = new L2CostsUpdater(peripherals.database, logger)

  return {
    routers: [l2CostsRouter],
    updater: l2CostsUpdater,
  }
}
