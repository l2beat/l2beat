import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { createDecoderModule } from '../modules/decoder-module/createDecoderModule'
import { createHttpServer } from './HttpServer'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const modules = [createDecoderModule(config, logger)]
    const httpServer = createHttpServer(config, modules, logger.for('Router'))

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')
    }
  }
}
