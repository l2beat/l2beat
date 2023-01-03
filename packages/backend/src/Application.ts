import { HttpClient, Logger } from '@l2beat/common'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Clock } from './core/Clock'
import { Metrics } from './Metrics'
import { createActivityModule } from './modules/activity/ActivityModule'
import { ApplicationModule } from './modules/ApplicationModule'
import { createDiscoveryModule } from './modules/discovery/DiscoveryModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createTvlModule } from './modules/tvl/TvlModule'
import { Database } from './peripherals/database/shared/Database'
import { handleServerError, reportError } from './tools/ErrorReporter'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({ ...config.logger, reportError })
    const database = new Database(
      config.database ? config.database.connection : undefined,
      config.name,
      logger,
    )
    const http = new HttpClient()
    const clock = new Clock(
      config.clock.minBlockTimestamp,
      config.clock.safeTimeOffsetSeconds,
    )

    const metrics = new Metrics()

    const modules: (ApplicationModule | undefined)[] = [
      createHealthModule(config),
      createMetricsModule(config, metrics),
      createTvlModule(config, logger, http, database, clock),
      createActivityModule(config, logger, http, database, clock),
      createDiscoveryModule(config, logger, http),
    ]

    const apiServer =
      config.api &&
      new ApiServer(
        config.api.port,
        logger,
        metrics,
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
      }

      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
