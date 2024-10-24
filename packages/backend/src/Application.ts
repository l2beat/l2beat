import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'

import { createDatabase } from '@l2beat/database'
import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { ApplicationModule } from './modules/ApplicationModule'
import { createActivityModule } from './modules/activity/ActivityModule'
import { createDaBeatModule } from './modules/da-beat/DaBeatModule'
import { createFinalityModule } from './modules/finality/FinalityModule'
import { createFlatSourcesModule } from './modules/flat-sources/createFlatSourcesModule'
import { createLzOAppsModule } from './modules/lz-oapps/createLzOAppsModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createTrackedTxsModule } from './modules/tracked-txs/TrackedTxsModule'
import { initTvlModule } from './modules/tvl/modules/TvlModule'
import { createUpdateMonitorModule } from './modules/update-monitor/UpdateMonitorModule'
import { createVerifiersModule } from './modules/verifiers/VerifiersModule'
import { Peripherals } from './peripherals/Peripherals'
import { initProviders } from './providers/initProviders'
import { Clock } from './tools/Clock'
import { getErrorReportingMiddleware } from './tools/ErrorReporter'

export class Application {
  start: () => Promise<void>

  constructor(config: Config, logger: Logger) {
    const kyselyDatabase = createDatabase({
      ...config.database.connection,
      ...config.database.connectionPoolSize,
    })

    const clock = new Clock(
      config.clock.minBlockTimestamp,
      config.clock.safeTimeOffsetSeconds,
      config.clock.hourlyCutoffDays,
      config.clock.sixHourlyCutoffDays,
    )

    const http = new HttpClient()
    const peripherals = new Peripherals(kyselyDatabase, http, logger)

    const trackedTxsModule = createTrackedTxsModule(
      config,
      logger,
      peripherals,
      clock,
    )

    const providers = initProviders(config.activity, logger, http)

    const modules: (ApplicationModule | undefined)[] = [
      createMetricsModule(config),
      createActivityModule(
        config,
        logger,
        clock,
        providers,
        peripherals.database,
      ),
      createUpdateMonitorModule(config, logger, peripherals, clock),
      createFlatSourcesModule(config, logger, peripherals),
      trackedTxsModule,
      createFinalityModule(
        config,
        logger,
        peripherals,
        trackedTxsModule?.indexer,
      ),
      createLzOAppsModule(config, logger),
      initTvlModule(config, logger, peripherals, clock),
      createVerifiersModule(config, logger, peripherals, clock),
      createDaBeatModule(config, logger, peripherals, clock),
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
      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
