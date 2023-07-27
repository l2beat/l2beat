import Router from '@koa/router'
import { ConfigReader } from '@l2beat/discovery'
import { Logger } from '@l2beat/shared'

import { StatusController } from '../../api/controllers/status/StatusController'
import { createStatusRouter } from '../../api/routers/StatusRouter'
import { Config } from '../../config/Config'
import { Clock } from '../../core/Clock'
import { AggregatedReportStatusRepository } from '../../peripherals/database/AggregatedReportStatusRepository'
import { BalanceStatusRepository } from '../../peripherals/database/BalanceStatusRepository'
import { UpdateMonitorRepository } from '../../peripherals/database/discovery/UpdateMonitorRepository'
import { PriceRepository } from '../../peripherals/database/PriceRepository'
import { ReportStatusRepository } from '../../peripherals/database/ReportStatusRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { TotalSupplyStatusRepository } from '../../peripherals/database/TotalSupplyStatusRepository'
import { ApplicationModule } from '../ApplicationModule'

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

  const priceRepository = new PriceRepository(database, logger)
  const reportStatusRepository = new ReportStatusRepository(database, logger)
  const balanceStatusRepository = new BalanceStatusRepository(database, logger)
  const totalSupplyStatusRepository = new TotalSupplyStatusRepository(
    database,
    logger,
  )
  const aggregatedStatusRepository = new AggregatedReportStatusRepository(
    database,
    logger,
  )

  const updateMonitorRepository = new UpdateMonitorRepository(database, logger)

  const statusController = new StatusController(
    priceRepository,
    balanceStatusRepository,
    totalSupplyStatusRepository,
    reportStatusRepository,
    aggregatedStatusRepository,
    updateMonitorRepository,
    clock,
    config.tokens,
    config.projects,
    configReader,
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
