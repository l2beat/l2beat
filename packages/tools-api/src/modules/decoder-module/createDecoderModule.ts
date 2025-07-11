import type { Logger } from '@l2beat/backend-tools'
import type { Config } from '../../config/types'

import type { ApplicationModule } from '../../services/ApplicationModule'
import { AlchemyClient } from '../../third-party/AlchemyClient'
import { EtherscanClient } from '../../third-party/EtherscanClient'
import { FourByteClient } from '../../third-party/FourByteClient'
import { OpenChainClient } from '../../third-party/OpenChainClient'
import { createDecoderRouter } from './createDecoderRouter'
import { AddressService } from './domain/AddressService'
import { ApiController } from './domain/ApiController'
import { Decoder } from './domain/Decoder'
import { SignatureService } from './domain/SignatureService'

export function createDecoderModule(
  config: Config,
  logger: Logger,
): ApplicationModule {
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
    config.chains,
  )

  const decoder = new Decoder(
    addressService,
    signatureService,
    config.tokens,
    config.hashes,
    config.chains,
  )

  const controller = new ApiController(decoder, alchemyClient, config.chains)
  const router = createDecoderRouter(controller)

  return {
    start: () => {},
    routers: [router],
  }
}
