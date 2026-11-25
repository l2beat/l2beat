import type { Config } from '../../config/types'

import type { ApplicationModule } from '../../services/ApplicationModule'
import { ChainRpcClient } from '../../third-party/ChainRpcClient'
import type { EtherscanClient } from '../../third-party/EtherscanClient'
import { RpcBudget } from '../../third-party/RpcBudget'
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
  const chainRpcClient = new ChainRpcClient(
    config.rpcUrls,
    new RpcBudget(RPC_BUDGET),
  )
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

/**
 * One budget for all chains, because most of them share one Alchemy key.
 * The API is public and has no auth, so this is what bounds the quota a
 * script can burn: 240 calls a minute is 345,600 a day at most. The burst
 * keeps normal use instant: a transaction hash with no chain id asks every
 * chain (one call each), and a decoded transaction asks for the code of
 * each address in it.
 */
const RPC_BUDGET = { burst: 240, callsPerMinute: 240 }
