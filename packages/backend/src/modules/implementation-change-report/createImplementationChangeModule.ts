import { Logger } from '@l2beat/backend-tools'
import { ConfigReader } from '@l2beat/discovery'

import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { ChainConverter } from '../../tools/ChainConverter'
import { ApplicationModule } from '../ApplicationModule'
import { UpdateMonitorRepository } from '../update-monitor/repositories/UpdateMonitorRepository'
import { createImplementationChangeRouter } from './api/createImplementationChangeRouter'
import { ImplementationChangeController } from './api/ImplementationChangeController'

export function createImplementationChangeModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.implementationChangeReporterEnabled) {
    logger.info('DiffHistory module disabled')
    return
  }

  const configReader = new ConfigReader()
  const chainConverter = new ChainConverter(config.chains)

  const controller = new ImplementationChangeController(
    peripherals.getRepository(UpdateMonitorRepository),
    configReader,
    chainConverter,
  )

  const routers = [createImplementationChangeRouter(controller)]

  const start = () => {}

  return {
    routers,
    start,
  }
}
