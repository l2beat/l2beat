import { Logger } from '@l2beat/backend-tools'
import type { Config } from '../config/types'
import { AddressService } from '../domain/AddressService'
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

    const decoder = new Decoder(addressService, signatureService)

    const httpServer = createHttpServer(config, logger.for('Router'))

    this.start = async () => {
      await httpServer.start()
      appLogger.info('Started')

      const decoded = await decoder.decode({
        to: 'eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        // biome-ignore lint/style/noNonNullAssertion: It's there
        chain: config.chains[0]!,
        data: '0xa9059cbb0000000000000000000000005318ffc5b00c9335511205f6ff460472673f410e0000000000000000000000000000000000000000000000000000000000f646e0',
      })
      console.log(JSON.stringify(decoded, null, 2))
    }
  }
}
