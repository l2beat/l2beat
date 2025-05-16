import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { AddressService } from '../domain/AddressService'
import { ApiController } from '../domain/ApiController'
import { Decoder } from '../domain/Decoder'
import { SignatureService } from '../domain/SignatureService'
import { createHttpServer } from './HttpServer'
import { AlchemyClient } from './api/AlchemyClient'
import { EtherscanClient } from './api/EtherscanClient'
import { FourByteClient } from './api/FourByteClient'
import { OpenChainClient } from './api/OpenChainClient'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    const logger = Logger.INFO
    const appLogger = logger.for(this)

    const openChainClient = new OpenChainClient()
    const fourByteClient = new FourByteClient()
    const signatureService = new SignatureService(
      openChainClient,
      fourByteClient,
      config.discovered,
      config.wellKnownAbi,
      logger,
    )

    const alchemyClient = new AlchemyClient(config.alchemyApiKey)
    const etherscanClient = new EtherscanClient(config.etherscanApiKey)
    const addressService = new AddressService(
      alchemyClient,
      etherscanClient,
      config.discovered,
      config.tokens,
    )

    const decoder = new Decoder(addressService, signatureService, config.tokens)

    const controller = new ApiController(decoder, config.chains)
    const httpServer = createHttpServer(
      config,
      controller,
      logger.for('Router'),
    )

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')
    }
  }
}
