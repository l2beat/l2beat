import type { Config } from '../../config/types'

import type { ApplicationModule } from '../../services/ApplicationModule'
import { AlchemyClient } from '../../third-party/AlchemyClient'
import type { EtherscanClient } from '../../third-party/EtherscanClient'
import { createDecoderRouter } from './createDecoderRouter'
import { AddressService } from './domain/AddressService'
import { ApiController } from './domain/ApiController'
import { Decoder } from './domain/Decoder'
import type { SignatureService } from './domain/SignatureService'

export function createDecoderModule(
  config: Config,
  signatureService: SignatureService,
  etherscanClient: EtherscanClient,
): ApplicationModule {
  const alchemyClient = new AlchemyClient(config.alchemyApiKey)
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

  const controller = new ApiController(
    decoder,
    signatureService,
    addressService,
    alchemyClient,
    config.chains,
    config.hashes,
  )
  const router = createDecoderRouter(config.chains, controller)

  return {
    start: () => {},
    routers: [router],
  }
}
