import { Logger } from '@l2beat/backend-tools'
import { ConfigReader } from '@l2beat/discovery'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { ChainConverter } from '../../tools/ChainConverter'
import { ApplicationModule } from '../ApplicationModule'
import { UpdateMonitorRepository } from '../update-monitor/repositories/UpdateMonitorRepository'
import { createDiffStateRouter } from './api/createDiffHistoryRouter'
import { DiffStateController } from './api/DiffStateController'

export function createDiffStateModule(
  config: Config,
  logger: Logger,
  database: Database,
): ApplicationModule | undefined {
  if (!config.diffStateEnabled) {
    logger.info('DiffHistory module disabled')
    return
  }

  const repository = new UpdateMonitorRepository(database, logger)
  const configReader = new ConfigReader()
  const chainConverter = new ChainConverter(config.chains)

  const controller = new DiffStateController(
    repository,
    configReader,
    chainConverter,
  )

  const routers = [createDiffStateRouter(controller)]

  const start = () => {}

  return {
    routers,
    start,
  }
}
