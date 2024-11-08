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
  ZksyncLiteClient,
} from '@l2beat/shared'
import {
  assert,
  ProjectId,
  assertUnreachable,
  notUndefined,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ActivityConfig } from '../config/Config'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'
import { StarkexClient } from '../peripherals/starkex/StarkexClient'
import { StarknetClient } from '../peripherals/starknet/StarknetClient'

export class BlockProviders {
  blockProviders: Map<string, BlockProvider> = new Map()
  timestampProviders: Map<string, BlockTimestampProvider> = new Map()

  constructor(
    private readonly config: ActivityConfig,
    private readonly clients: BlockClient[],
    readonly starknetClient: StarknetClient | undefined,
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
        blockClients: clients,
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
      case 'degate':
      case 'loopring':
      case 'fuel': {
        const blockClients = this.clients.filter((r) => r.chain === chain)
        assert(blockClients.length > 0, `No configured clients for ${chain}`)
        return new BlockTimestampProvider({ indexerClients, blockClients })
      }
      case 'starknet': {
        assert(this.starknetClient, 'starknetClient should be defined')
        const blockClients = [this.starknetClient]
        return new BlockTimestampProvider({ indexerClients, blockClients })
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
  let zksyncLiteClient: ZksyncLiteClient | undefined
  let starknetClient: StarknetClient | undefined
  let loopringClient: LoopringClient | undefined
  let degateClient: LoopringClient | undefined
  let starkexClient: StarkexClient | undefined
  let fuelClient: FuelClient | undefined

  const evmClients: RpcClient2[] = []
  const indexerClients: BlockIndexerClient[] = []
  //todo indexer clients

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
          retryHandler,
          logger,
        })

        evmClients.push(rpcClient)

        break
      }
      case 'zksync': {
        zksyncLiteClient = new ZksyncLiteClient({
          url: project.config.url,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          logger,
        })
        break
      }
      case 'starknet': {
        starknetClient = new StarknetClient(project.config.url, http, {
          callsPerMinute: project.config.callsPerMinute,
        })
        break
      }
      case 'loopring': {
        loopringClient = new LoopringClient({
          http: http2,
          logger,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          url: project.config.url,
          type: 'loopring',
        })
        break
      }
      case 'degate': {
        degateClient = new LoopringClient({
          http: http2,
          logger,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          url: project.config.url,
          type: 'degate',
        })
        break
      }
      case 'starkex': {
        starkexClient = new StarkexClient(config.starkexApiKey, http, logger, {
          callsPerMinute: config.starkexCallsPerMinute,
        })
        break
      }
      case 'fuel': {
        fuelClient = new FuelClient({
          url: project.config.url,
          http: http2,
          rateLimiter: new RateLimiter({
            callsPerMinute: project.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          logger,
        })
        break
      }
      default:
        assertUnreachable(project.config)
    }
  }

  const otherClients = [
    zksyncLiteClient,
    degateClient,
    loopringClient,
    fuelClient,
  ].filter(notUndefined)

  return new BlockProviders(
    config,
    [...evmClients, ...otherClients],
    starknetClient,
    starkexClient,
    indexerClients,
  )
}
