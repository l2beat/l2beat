import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { createActivityModule } from './modules/activity/ActivityModule'
import { ApplicationModule } from './modules/ApplicationModule'
import { createDiffHistoryModule } from './modules/diff-history/createDiffHistoryModule'
import { createFinalityModule } from './modules/finality/FinalityModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createImplementationChangeModule } from './modules/implementation-change-report/createImplementationChangeModule'
import { createLzOAppsModule } from './modules/lz-oapps/createLzOAppsModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createStatusModule } from './modules/status/StatusModule'
import { createTrackedTxsModule } from './modules/tracked-txs/TrackedTxsModule'
import { createTvlModule } from './modules/tvl/modules/TvlModule'
import { createTvl2Module } from './modules/tvl2/Tvl2Module'
import { createUpdateMonitorModule } from './modules/update-monitor/UpdateMonitorModule'
import { Database } from './peripherals/database/Database'
import { Peripherals } from './peripherals/Peripherals'
import { Clock } from './tools/Clock'
import { getErrorReportingMiddleware, reportError } from './tools/ErrorReporter'

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
    const clock = new Clock(
      config.clock.minBlockTimestamp,
      config.clock.safeTimeOffsetSeconds,
    )

    const http = new HttpClient()
    const peripherals = new Peripherals(database, http, logger)

    const trackedTxsModule = createTrackedTxsModule(
      config,
      logger,
      peripherals,
      clock,
    )

    const modules: (ApplicationModule | undefined)[] = [
      createHealthModule(config),
      createMetricsModule(config),
      createTvlModule(config, logger, peripherals, clock),
      createActivityModule(config, logger, peripherals, clock),
      createUpdateMonitorModule(config, logger, peripherals, clock),
      createDiffHistoryModule(config, logger, peripherals),
      createImplementationChangeModule(config, logger, peripherals),
      createStatusModule(config, logger),
      trackedTxsModule,
      createFinalityModule(
        config,
        logger,
        peripherals,
        trackedTxsModule?.indexer,
      ),
      createLzOAppsModule(config, logger),
      createTvl2Module(config, logger, http, peripherals, clock),
    ]

    const apiServer = new ApiServer(
      config.api.port,
      logger,
      modules.flatMap((x) => x?.routers ?? []),
      getErrorReportingMiddleware(),
    )

    this.start = async () => {
      logger.for(this).info('Starting', { features: config.flags })

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
