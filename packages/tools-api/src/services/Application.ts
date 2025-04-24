import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { SignatureClient } from '../domain/SignatureClient'
import { createHttpServer } from './HttpServer'
import { FourByteClient } from './api/FourByteClient'
import { OpenChainClient } from './api/OpenChainClient'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const openChainClient = new OpenChainClient()
    const fourByteClient = new FourByteClient()
    const signatureClient = new SignatureClient(
      openChainClient,
      fourByteClient,
      logger,
    )

    const httpServer = createHttpServer(config, logger.for('Router'))

    this.start = async () => {
      await httpServer.start()
      console.log(await signatureClient.lookup('0xa9059cbb'))
      appLogger.info('Started')
    }
  }
}
