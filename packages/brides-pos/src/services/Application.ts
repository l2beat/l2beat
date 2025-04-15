import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/config'
import { ChainProcessor } from '../logic/ChainProcessor'
import { MessageService } from '../logic/MessageService'
import { createHttpServer } from './HttpServer'
import { createPublicClient } from './PublicClient'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const messageService = new MessageService(logger)

    const processors: ChainProcessor[] = []
    for (const chain of config.chains) {
      const client = createPublicClient(chain)
      if (!client) {
        appLogger.warn(`Skipping processor for ${chain.name}`)
        continue
      }
      const processor = new ChainProcessor(
        chain,
        client,
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
