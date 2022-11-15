import Router from '@koa/router'
import { HttpClient, Logger } from '@l2beat/common'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Clock } from './core/Clock'
import { createActivityModule } from './modules/activity/ActivityModule'
import { createActivityV2Module } from './modules/activityV2/ActivityV2Module'
import { createDiscoveryModule } from './modules/discovery/DiscoveryModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createTvlModule } from './modules/tvl/TvlModule'
import { Database } from './peripherals/database/shared/Database'
import { handleServerError, reportError } from './tools/ErrorReporter'

interface ApplicationModule {
  routers: Router[]
  start?: () => Promise<void> | void
}

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({ ...config.logger, reportError })
    const database = new Database(config.databaseConnection, logger)
    const http = new HttpClient()
    const clock = new Clock(
      config.core.minBlockTimestamp,
      config.core.safeTimeOffsetSeconds,
    )

    const modules: ApplicationModule[] = [
      createHealthModule(config),
      createTvlModule(config, logger, http, database, clock),
      createActivityModule(config, logger, http, database, clock),
      createActivityV2Module(config, logger, http, database, clock),
      createDiscoveryModule(config, 'zksync'),
    ]

    const apiServer = new ApiServer(
      config.port,
      logger,
      modules.flatMap((x) => x.routers),
      handleServerError,
    )

    this.start = async () => {
      logger.for(this).info('Starting')

      if (config.apiEnabled) {
        await apiServer.listen()
      }

      if (config.databaseConnection) {
        if (config.freshStart) {
          await database.rollbackAll()
        }
        await database.migrateToLatest()
      }

      if (config.syncEnabled) {
        for (const module of modules) {
          await module.start?.()
        }
      }
    }
  }
}
