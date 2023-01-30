import { ApiServer } from './api/ApiServer'
import { Config } from './config'
import { Metrics } from './Metrics'
import { ApplicationModule } from './modules/ApplicationModule'
import { createDiscoveryModule } from './modules/discovery/DiscoveryModule'
import { createDiscoveryApiModule } from './modules/discoveryApi/DiscoveryApiModule'
import { createHealthModule } from './modules/health/HealthModule'
import { createMetricsModule } from './modules/metrics/MetricsModule'
import { HttpClient } from './peripherals/HttpClient'
import { handleServerError, reportError } from './tools/ErrorReporter'
import { Logger } from './tools/Logger'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = new Logger({ ...config.logger, reportError })
    const http = new HttpClient()

    const metrics = new Metrics()

    const modules: (ApplicationModule | undefined)[] = [
      createHealthModule(config),
      createMetricsModule(config, metrics),
      createDiscoveryModule(config, logger, http),
      createDiscoveryApiModule(config, logger, http),
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

      for (const module of modules) {
        await module?.start?.()
      }
    }
  }
}
