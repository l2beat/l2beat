import { Logger } from '@l2beat/backend-tools'
import type { Config } from './config/types'
import { createHttpServer } from './create-http'
import type { ApplicationModule } from './module'
import { createInfrastructureModule } from './modules/infra/infra-module'

export class Application {
  static applicationName = 'WatchTower'
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO.for(Application.applicationName)

    const modules: ApplicationModule[] = [
      createInfrastructureModule({ logger, config }),
    ]
    const httpServer = createHttpServer(config, modules, logger.for('HTTP'))

    this.start = async () => {
      await httpServer.start()
      logger.info('Started')
    }
  }
}
