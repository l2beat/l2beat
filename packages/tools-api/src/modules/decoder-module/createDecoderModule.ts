import type { Config } from '../../config/types'

import type { ApplicationModule } from '../../services/ApplicationModule'
import { ChainRpcClient } from '../../third-party/ChainRpcClient'
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
  const chainRpcClient = new ChainRpcClient(config.rpcUrls)
  const addressService = new AddressService(
    chainRpcClient,
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
    chainRpcClient,
    config.chains,
    config.hashes,
  )
  const router = createDecoderRouter(config.chains, controller)

  return {
    start: () => {},
    routers: [router],
  }
}
