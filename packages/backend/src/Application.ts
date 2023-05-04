import { HttpClient, Logger, LogThrottler } from '@l2beat/shared'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Clock } from './core/Clock'
import { createActivityModule } from './modules/activity/ActivityModule'
import { ApplicationModule } from './modules/ApplicationModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createTvlModule } from './modules/tvl/TvlModule'
import { createUpdateMonitorModule } from './modules/update-monitor/UpdateMonitorModule'
import { Database } from './peripherals/database/shared/Database'
import { handleServerError, reportError } from './tools/ErrorReporter'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const loggerOptions = { ...config.logger, reportError }

    const logThrottler = config.logThrottler
      ? new LogThrottler(config.logThrottler, new Logger(loggerOptions))
      : undefined
    const logger = new Logger(loggerOptions, logThrottler)

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

      database.enableQueryLogging()

      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
