import Router from '@koa/router'
import { Logger } from '@l2beat/backend-tools'
import { ConfigReader } from '@l2beat/discovery'

import { Config } from '../../config/Config'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { ChainConverter } from '../../tools/ChainConverter'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { LivenessConfigurationRepository } from '../liveness/repositories/LivenessConfigurationRepository'
import { StatusController } from './api/StatusController'
import { createStatusRouter } from './api/StatusRouter'

export function createStatusModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.statusEnabled) {
    logger.info('StatusModule disabled')
    return
  }
  const configReader = new ConfigReader()

  const totalSupplyStatusRepository = new TotalSupplyStatusRepository(
    database,
    logger,
  )

  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessConfigurationRepository = new LivenessConfigurationRepository(
    database,
    logger,
  )

  const chainConverter = new ChainConverter(config.chains)

  const statusController = new StatusController(
    totalSupplyStatusRepository,
    updateMonitorRepository,
    clock,
    config.projects,
    configReader,
    indexerStateRepository,
    livenessConfigurationRepository,
    chainConverter,
  )

  const routers: Router[] = [createStatusRouter(statusController)]

  const start = () => {
    logger = logger.for('StatusModule')
    logger.info('Started')
  }

  return {
    start,
    routers,
  }
}
