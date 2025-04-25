import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { AddressService } from '../domain/AddressService'
import { SignatureClient } from '../domain/SignatureClient'
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
    const signatureClient = new SignatureClient(
      openChainClient,
      fourByteClient,
      logger,
    )

    const alchemyClient = new AlchemyClient(config.alchemyApiKey)
    const etherscanClient = new EtherscanClient(config.etherscanApiKey)

    const httpServer = createHttpServer(config, logger.for('Router'))

    const addressService = new AddressService(
      alchemyClient,
      etherscanClient,
      config.discovered,
      config.tokens,
    )

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')

      console.log(await signatureClient.lookup('0x95512306'))
      console.log(
        await addressService.lookup(
          'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          config.chains[0]!,
        ),
      )
    }
  }
}
