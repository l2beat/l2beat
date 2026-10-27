import { Logger } from '@l2beat/backend-tools'
import { HttpClient, RpcClientCompat } from '@l2beat/shared'
import type { Config } from '../../config/types'
import type { ApplicationModule } from '../../services/ApplicationModule'
import type { EtherscanClient } from '../../third-party/EtherscanClient'
import type { SignatureService } from '../decoder-module/domain/SignatureService'
import { createUopsRouter } from './createUopsRouter'
import { ChainService } from './domain/ChainService'
import { type KnownNames, loadKnownNames } from './domain/KnownNames'
import { NameService } from './domain/NameService'
import { RpcCodeClient } from './domain/RpcCodeClient'
import { RpcCounter } from './domain/RpcCounter'
import { StarknetClient } from './domain/StarknetClient'
import { StarknetCounter } from './domain/StarknetCounter'
import type { UopsChain } from './types'

const RPC_CALLS_PER_MINUTE_DEFAULT = 100

export function createUopsModule(
  config: Config,
  signatureService: SignatureService,
  etherscanClient: EtherscanClient,
  logger: Logger,
): ApplicationModule {
  const knownNames = loadKnownNames()
  const chainServices = new Map<string, ChainService>()
  for (const chain of config.uopsChains) {
    chainServices.set(
      chain.id,
      createChainService(
        chain,
        knownNames,
        signatureService,
        etherscanClient,
        logger,
      ),
    )
  }

  const router = createUopsRouter(config.uopsChains, chainServices, logger)
  return { routers: [router] }
}

function createChainService(
  chain: UopsChain,
  knownNames: KnownNames,
  signatureService: SignatureService,
  etherscanClient: EtherscanClient,
  logger: Logger,
): ChainService {
  const { type, url } = chain.blockchainApi
  if (type === 'starknet') {
    return new ChainService(new StarknetClient(url), new StarknetCounter())
  }

  const callsPerMinute =
    chain.blockchainApi.callsPerMinute ?? RPC_CALLS_PER_MINUTE_DEFAULT
  const blockClient = RpcClientCompat.create({
    url,
    chain: chain.id,
    http: new HttpClient(),
    callsPerMinute,
    logger: Logger.SILENT,
    retryStrategy: 'RELIABLE',
  })
  const etherscanChainId = chain.etherscanChainId
  const contractClient =
    etherscanChainId === undefined
      ? undefined
      : {
          getName: async (address: string) => {
            const info = await etherscanClient.getContractInfo(
              etherscanChainId,
              address as `0x${string}`,
            )
            return info.name
          },
        }
  const nameService = new NameService(
    knownNames,
    signatureService,
    new RpcCodeClient(url, callsPerMinute),
    contractClient,
    logger,
  )
  return new ChainService(blockClient, new RpcCounter(), nameService)
}
