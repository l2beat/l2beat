import { HttpClient, Logger, LogThrottler } from '@l2beat/shared'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Clock } from './core/Clock'
import { createActivityModule } from './modules/activity/ActivityModule'
import { ApplicationModule } from './modules/ApplicationModule'
import { createDiscoveryModule } from './modules/discovery/DiscoveryModule'
import { createDiscoveryWatcherModule } from './modules/discoveryWatcher/DiscoveryWatcherModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createInversionModule } from './modules/inversion/InversionModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createTvlModule } from './modules/tvl/TvlModule'
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
      config.database ? config.database.connection : undefined,
      config.name,
      logger,
      {
        minConnectionPoolSize: config.database
          ? config.database.connectionPoolSize.min
          : undefined,
        maxConnectionPoolSize: config.database
          ? config.database.connectionPoolSize.max
          : undefined,
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
      createDiscoveryModule(config, logger, http),
      createDiscoveryWatcherModule(config, logger, http, database, clock),
      createInversionModule(config, logger),
    ]

    const apiServer =
      config.api &&
      new ApiServer(
        config.api.port,
        logger,
        modules.flatMap((x) => x?.routers ?? []),
        handleServerError,
      )

    this.start = async () => {
      logger.for(this).info('Starting')

      if (apiServer) {
        await apiServer.listen()
      }

      if (config.database) {
        await database.assertRequiredServerVersion()
        if (config.database.freshStart) {
          await database.rollbackAll()
        }
        await database.migrateToLatest()

        database.enableQueryLogging()
      }

      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
