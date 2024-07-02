import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../../../config'
import { Peripherals } from '../../../../peripherals/Peripherals'
import { IndexerConfigurationRepository } from '../../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../../tools/uif/IndexerStateRepository'
import { ApplicationModuleWithUpdater } from '../../../ApplicationModule'
import { L2CostsUpdater } from './L2CostsUpdater'
import { L2CostsController } from './api/L2CostsController'
import { createL2CostsRouter } from './api/L2CostsRouter'
import { AggregatedL2CostsRepository } from './repositories/AggregatedL2CostsRepository'
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

  const l2CostsController = new L2CostsController({
    indexerService,
    aggregatedL2CostsRepository: peripherals.getRepository(
      AggregatedL2CostsRepository,
    ),
    projects: config.projects,
    logger,
  })

  const l2CostsRouter = createL2CostsRouter(l2CostsController)

  const l2CostsUpdater = new L2CostsUpdater(
    peripherals.getRepository(L2CostsRepository),
    logger,
  )

  return {
    routers: [l2CostsRouter],
    updater: l2CostsUpdater,
  }
}
