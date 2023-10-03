import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Clock } from './core/Clock'
import { createActivityModule } from './modules/activity/ActivityModule'
import { ApplicationModule } from './modules/ApplicationModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createStatusModule } from './modules/status/StatusModule'
import { createTvlModule } from './modules/tvl/TvlModule'
import { createUpdateMonitorModule } from './modules/update-monitor/UpdateMonitorModule'
import { Database } from './peripherals/database/shared/Database'
import { handleServerError, reportError } from './tools/ErrorReporter'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const loggerOptions = { ...config.logger, reportError }

    let logger = new Logger(loggerOptions)
    if (config.logThrottler) {
      logger = logger.withThrottling(config.logThrottler)
    }

    const database = new Database(
      config.database.connection,
      config.name,
      logger,
      {
        minConnectionPoolSize: config.database.connectionPoolSize.min,
        maxConnectionPoolSize: config.database.connectionPoolSize.max,
      },
    )
    const http = new HttpClient()
    const clock = new Clock(
      config.clock.minBlockTimestamp,
      config.clock.safeTimeOffsetSeconds,
    )

    const modules: (ApplicationModule | undefined)[] = [
      createHealthModule(config),
      createMetricsModule(config),
      createTvlModule(config, logger, http, database, clock),
      createActivityModule(config, logger, http, database, clock),
      createUpdateMonitorModule(config, logger, http, database, clock),
      createStatusModule(config, logger, database, clock),
    ]

    const apiServer = new ApiServer(
      config.api.port,
      logger,
      modules.flatMap((x) => x?.routers ?? []),
      handleServerError,
    )

    this.start = async () => {
      logger.for(this).info('Starting')

      await apiServer.listen()

      await database.assertRequiredServerVersion()
      if (config.database.freshStart) {
        await database.rollbackAll()
      }
      await database.migrateToLatest()

      if (
        config.logger.logLevel === 'DEBUG' ||
        config.logger.logLevel === 'TRACE'
      ) {
        database.enableQueryLogging()
      }

      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
