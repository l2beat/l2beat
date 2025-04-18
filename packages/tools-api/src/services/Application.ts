import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { createHttpServer } from './HttpServer'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    console.log(config.discovered.allAbis.length)

    const httpServer = createHttpServer(config, logger.for('Router'))

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')
    }
  }
}
