import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/config'
import { ChainProcessor } from '../logic/ChainProcessor'
import { MessageService } from '../logic/MessageService'
import { createHttpServer } from './HttpServer'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const messageService = new MessageService()

    const processors: ChainProcessor[] = []
    for (const chain of config.chains) {
      if (!chain.rpcUrl) {
        appLogger.warn(`Skipping ChainListener for ${chain.name}`)
        continue
      }
      const processor = new ChainProcessor(
        chain,
        chain.rpcUrl,
        messageService,
        logger,
      )
      processors.push(processor)
    }

    const httpServer = createHttpServer(
      config,
      messageService,
      logger.for('Router'),
    )

    this.start = async () => {
      await Promise.all(processors.map((p) => p.start()))
      await httpServer.start()
      appLogger.info('Started')
    }
  }
}
