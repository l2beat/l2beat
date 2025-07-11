import type { Logger } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import { HttpClient } from '@l2beat/shared'
import { ApiServer } from './api/ApiServer'
import type { Config } from './config'
import type { ApplicationModule } from './modules/ApplicationModule'
import { initActivityModule } from './modules/activity/ActivityModule'
import { createDaBeatModule } from './modules/da-beat/DaBeatModule'
import { initDataAvailabilityModule } from './modules/data-availability/DataAvailabilityModule'
import { createFlatSourcesModule } from './modules/flat-sources/createFlatSourcesModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { createSharedModule } from './modules/shared/SharedModule'
import { createTrackedTxsModule } from './modules/tracked-txs/TrackedTxsModule'
import { initTvsModule } from './modules/tvs/TvsModule'
import { createUpdateMonitorModule } from './modules/update-monitor/UpdateMonitorModule'
import { createVerifiersModule } from './modules/verifiers/VerifiersModule'
import { Peripherals } from './peripherals/Peripherals'
import { Providers } from './providers/Providers'
import { Clock } from './tools/Clock'

export class Application {
  start: () => Promise<void>

  constructor(config: Config, logger: Logger) {
    const appLogger = logger.for(this)

    appLogger.info('Initializing App')

    appLogger.info('Initializing DB', {
      poolSize: config.database.connectionPoolSize,
      appName: config.database.connection.application_name,
    })

    const database = createDatabase({
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
    const peripherals = new Peripherals(database, http, logger)
    const providers = new Providers(config, logger)

    const trackedTxsModule = createTrackedTxsModule(
      config,
      logger,
      peripherals,
      providers,
      clock,
    )

    const modules: (ApplicationModule | undefined)[] = [
      createMetricsModule(config),
      createSharedModule(config, logger, clock, providers, database),
      initActivityModule(config, logger, clock, providers, database),
      initDataAvailabilityModule(
        config,
        logger,
        clock,
        providers,
        database,
        peripherals,
      ),
      createUpdateMonitorModule(config, logger, peripherals, clock),
      createFlatSourcesModule(config, logger, peripherals),
      trackedTxsModule,
      initTvsModule(config, logger, database, providers, clock),
      createVerifiersModule(config, logger, peripherals, clock),
      createDaBeatModule(config, logger, peripherals, providers, clock),
    ]

    const apiServer = new ApiServer(
      config.api.port,
      logger,
      modules.flatMap((x) => x?.routers ?? []),
    )

    if (config.isReadonly) {
      this.start = async () => {
        appLogger.info('Starting in readonly mode')
        await apiServer.start()
      }
      return
    }

    this.start = async () => {
      appLogger.info('Starting', { features: config.flags })
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
