import { HttpClient, Logger } from '@l2beat/common'
import { compact } from 'lodash'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Clock } from './core/Clock'
import { getActivityModule } from './modules/activity/ActivityModule'
import { getActivityV2Module } from './modules/activityV2/ActivityV2Module'
import { getHealthModule } from './modules/health/HealthModule'
import { getTvlModule } from './modules/tvl/TvlModule'
import { Database } from './peripherals/database/shared/Database'
import { handleServerError, reportError } from './tools/ErrorReporter'

export class Server {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({ ...config.logger, reportError })
    const database = new Database(config.databaseConnection, logger)
    const http = new HttpClient()
    const clock = new Clock(
      config.core.minBlockTimestamp,
      config.core.safeTimeOffsetSeconds,
    )

    const healthModule = getHealthModule(config)
    const tvlModule = getTvlModule(config, logger, http, database, clock)
    const activityModule = getActivityModule(
      config,
      logger,
      http,
      database,
      clock,
    )
    const activityV2Module = getActivityV2Module(
      config,
      logger,
      http,
      database,
      clock,
    )

    const apiServer = new ApiServer(
      config.port,
      logger,
      compact([
        ...tvlModule.routers,
        activityModule?.router,
        activityV2Module?.router,
        healthModule.router,
      ]),
      handleServerError,
    )

    this.start = async () => {
      logger.for(this).info('Starting')

      await apiServer.listen()
      if (config.freshStart) await database.rollbackAll()
      await database.migrateToLatest()

      if (config.syncEnabled) {
        await tvlModule.start()
        activityModule?.start()
        activityV2Module?.start()
      }
    }
  }
}
