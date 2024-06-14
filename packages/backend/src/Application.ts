import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'

import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { ApplicationModule } from './modules/ApplicationModule'
import { createActivityModule } from './modules/activity/ActivityModule'
import { createFeaturesModule } from './modules/features/FeaturesModule'
import { createFinalityModule } from './modules/finality/FinalityModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createImplementationChangeModule } from './modules/implementation-change-report/createImplementationChangeModule'
import { createLzOAppsModule } from './modules/lz-oapps/createLzOAppsModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createStatusModule } from './modules/status/StatusModule'
import { createTrackedTxsModule } from './modules/tracked-txs/TrackedTxsModule'
import { createTvlModule } from './modules/tvl/modules/TvlModule'
import { createUpdateMonitorModule } from './modules/update-monitor/UpdateMonitorModule'
import { createVerifiersModule } from './modules/verifiers/VerifiersModule'
import { Peripherals } from './peripherals/Peripherals'
import { Database } from './peripherals/database/Database'
import { Clock } from './tools/Clock'
import { getErrorReportingMiddleware } from './tools/ErrorReporter'

export class Application {
  start: () => Promise<void>

  constructor(config: Config, logger: Logger) {
    const database = new Database(config.database, logger, config.name)
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
      createActivityModule(config, logger, peripherals, clock),
      createUpdateMonitorModule(config, logger, peripherals, clock),
      createImplementationChangeModule(config, logger, peripherals),
      createStatusModule(config, logger, peripherals),
      trackedTxsModule,
      createFinalityModule(
        config,
        logger,
        peripherals,
        trackedTxsModule?.indexer,
      ),
      createLzOAppsModule(config, logger),
      createTvlModule(config, logger, peripherals, clock),
      createVerifiersModule(config, logger, peripherals),
      createFeaturesModule(config),
    ]

    const apiServer = new ApiServer(
      config.api.port,
      logger,
      modules.flatMap((x) => x?.routers ?? []),
      getErrorReportingMiddleware(),
    )

    if (config.isReadonly) {
      this.start = async () => {
        logger.for(this).info('Starting in readonly mode')
        await apiServer.start()
      }
      return
    }

    this.start = async () => {
      logger.for(this).info('Starting', { features: config.flags })
      const unusedFlags = Object.values(config.flags)
        .filter((x) => !x.used)
        .map((x) => x.feature)
      if (unusedFlags.length > 0) {
        logger
          .for(this)
          .warn('Some feature flags are not used', { unusedFlags })
      }

      await apiServer.start()
      await database.start()
      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
