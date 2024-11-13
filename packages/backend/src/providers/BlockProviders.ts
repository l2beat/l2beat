import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  BlockClient,
  BlockIndexerClient,
  BlockProvider,
  FuelClient,
  HttpClient,
  HttpClient2,
  LoopringClient,
  RetryHandler,
  RpcClient2,
  StarknetClient,
  ZksyncLiteClient,
} from '@l2beat/shared'
import { assert, ProjectId, assertUnreachable } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ActivityConfig } from '../config/Config'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'
import { StarkexClient } from '../peripherals/starkex/StarkexClient'

export class BlockProviders {
  blockProviders: Map<string, BlockProvider> = new Map()
  timestampProviders: Map<string, BlockTimestampProvider> = new Map()

  constructor(
    private readonly config: ActivityConfig,
    private readonly clients: BlockClient[],
    readonly starkexClient: StarkexClient | undefined,
    private readonly indexerClients: BlockIndexerClient[],
  ) {
    const byChain = groupBy(clients, (c) => c.chain)
    for (const [chain, clients] of Object.entries(byChain)) {
      const block = new BlockProvider(clients)
      this.blockProviders.set(chain, block)

      const indexerClients = this.indexerClients.filter(
        (c) => c.chain === chain,
      )
      const timestamp = new BlockTimestampProvider({
        blockProvider: block,
        indexerClients,
      })
      this.timestampProviders.set(chain, timestamp)
    }
  }

  getBlockProvider(chain: string) {
    const provider = this.blockProviders.get(chain)
    assert(provider, `Provider not found: ${chain}`)
    return provider
  }

  // TODO: refactor in the same way as blocks
  getBlockTimestampProvider(chain: string) {
    const project = this.config.projects.find((p) => p.id === chain)
    assert(project, `Project ${chain} not found`)

    const indexerClients = this.indexerClients.filter((c) => c.chain === chain)

    switch (project.config.type) {
      case 'rpc':
      case 'zksync':
      case 'fuel':
      case 'starknet':
      case 'degate3':
      case 'loopring': {
        const blockProvider = this.getBlockProvider(chain)
        return new BlockTimestampProvider({
          indexerClients,
          blockProvider,
        })
      }
      case 'starkex': {
        throw new Error('Starkex should not be handled with this method')
      }
      default:
        assertUnreachable(project.config)
    }
  }
}

export function initBlockProviders(config: ActivityConfig): BlockProviders {
  let starkexClient: StarkexClient | undefined

  const blockClients: BlockClient[] = []
  const indexerClients: BlockIndexerClient[] = []

  const http = new HttpClient()
  const http2 = new HttpClient2()
  const logger = Logger.SILENT

  for (const project of config.projects) {
    if (project.blockExplorerConfig) {
      indexerClients.push(
        new BlockIndexerClient(http, new RateLimiter({ callsPerMinute: 120 }), {
          ...project.blockExplorerConfig,
          chain: project.id,
        }),
      )
    }

    switch (project.config.type) {
      case 'rpc': {
        const retryHandler =
          project.id === ProjectId('zkfair')
            ? RetryHandler.UNRELIABLE_API(logger)
            : RetryHandler.RELIABLE_API(logger)

        // TODO: handle multiple urls
        const rpcClient = new RpcClient2({
          url: project.config.url,
          chain: project.id,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          // TODO: handle different retry strategies
          retryHandler,
          logger,
        })

        blockClients.push(rpcClient)

        break
      }
      case 'zksync': {
        const zksyncLiteClient = new ZksyncLiteClient({
          url: project.config.url,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          logger,
        })
        blockClients.push(zksyncLiteClient)
        break
      }
      case 'starknet': {
        const starknetClient = new StarknetClient({
          url: project.config.url,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          logger,
        })
        blockClients.push(starknetClient)
        break
      }
      case 'loopring':
      case 'degate3': {
        const loopringClient = new LoopringClient({
          http: http2,
          logger,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          url: project.config.url,
          type: project.config.type,
        })
        blockClients.push(loopringClient)
        break
      }
      case 'starkex': {
        starkexClient = new StarkexClient(config.starkexApiKey, http, logger, {
          callsPerMinute: config.starkexCallsPerMinute,
        })
        break
      }
      case 'fuel': {
        const fuelClient = new FuelClient({
          url: project.config.url,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          logger,
        })
        blockClients.push(fuelClient)
        break
      }
      default:
        assertUnreachable(project.config)
    }
  }

  return new BlockProviders(config, blockClients, starkexClient, indexerClients)
}
