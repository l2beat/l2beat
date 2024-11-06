import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  BlockIndexerClient,
  BlockProvider,
  HttpClient,
  HttpClient2,
  RetryHandler,
  RpcClient2,
} from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { TvlConfig } from '../config/Config'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'

export class TvlBlockProviders {
  constructor(
    private readonly config: TvlConfig,
    private readonly evmClients: RpcClient2[],
    private readonly indexerClients: BlockIndexerClient[],
  ) {}

  getEvmBlockProvider(chain: string) {
    const clients = this.evmClients.filter((r) => r.chain === chain)
    assert(clients.length > 0, `No configured clients for ${chain}`)

    return new BlockProvider(clients)
  }

  getBlockTimestampProvider(chain: string) {
    const project = this.config.chains.find((p) => p.chain === chain)
    assert(project, `Project ${chain} not found`)

    const indexerClients = this.indexerClients.filter((c) => c.chain === chain)
    const blockClients = this.evmClients.filter((r) => r.chain === chain)
    assert(blockClients.length > 0, `No configured clients for ${chain}`)

    return new BlockTimestampProvider({ indexerClients, blockClients })
  }
}

export function initTvlBlockProviders(config: TvlConfig): TvlBlockProviders {
  const evmClients: RpcClient2[] = []
  const indexerClients: BlockIndexerClient[] = []
  const http = new HttpClient()
  const http2 = new HttpClient2()
  const logger = Logger.SILENT

  for (const project of config.chains) {
    if (project.config === undefined) {
      continue
    }
    if (project.config.blockExplorerConfig) {
      indexerClients.push(
        new BlockIndexerClient(http, new RateLimiter({ callsPerMinute: 120 }), {
          ...project.config.blockExplorerConfig,
          chain: project.chain,
        }),
      )
    }

    const retryHandler =
      project.chain === ProjectId('zkfair')
        ? RetryHandler.UNRELIABLE_API(logger)
        : RetryHandler.RELIABLE_API(logger)

    const rpcClient = new RpcClient2({
      url: project.config.providerUrl,
      http: http2,
      rateLimiter: new RateLimiter({
        callsPerMinute: project.config.providerCallsPerMinute,
      }),
      retryHandler,
      logger,
      chain: project.chain,
    })

    evmClients.push(rpcClient)
  }

  return new TvlBlockProviders(config, evmClients, indexerClients)
}
