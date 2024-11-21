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
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { ChainConfig } from '../config/Config'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'
import { StarkexClient } from '../peripherals/starkex/StarkexClient'

export class BlockProviders {
  blockProviders: Map<string, BlockProvider> = new Map()
  timestampProviders: Map<string, BlockTimestampProvider> = new Map()

  constructor(
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
    const blockProvider = this.blockProviders.get(chain)
    assert(blockProvider, `BlockProvider not found: ${chain}`)
    return blockProvider
  }

  // TODO: refactor in the same way as blocks
  getBlockTimestampProvider(chain: string) {
    const timestampProvider = this.timestampProviders.get(chain)
    assert(timestampProvider, `TimestampProvider not found: ${chain}`)
    return timestampProvider
  }
}

export function initBlockProviders(chains: ChainConfig[]): BlockProviders {
  let starkexClient: StarkexClient | undefined

  const blockClients: BlockClient[] = []
  const indexerClients: BlockIndexerClient[] = []

  const http = new HttpClient()
  const http2 = new HttpClient2()
  const logger = Logger.SILENT

  for (const chain of chains) {
    for (const indexerApi of chain.indexerApis) {
      const indexerClient = new BlockIndexerClient(
        http,
        new RateLimiter({ callsPerMinute: 120 }),
        {
          chain: chain.name,
          ...indexerApi,
        },
      )
      indexerClients.push(indexerClient)
    }

    for (const blockApi of chain.blockApis) {
      const retryHandler =
        blockApi.retryStrategy === 'RELIABLE'
          ? RetryHandler.RELIABLE_API(logger)
          : RetryHandler.UNRELIABLE_API(logger)
      const rateLimiter = new RateLimiter({
        callsPerMinute: blockApi.callsPerMinute,
      })

      switch (blockApi.type) {
        case 'rpc': {
          const rpcClient = new RpcClient2({
            chain: chain.name,
            url: blockApi.url,
            http: http2,
            rateLimiter,
            retryHandler,
            logger,
          })
          blockClients.push(rpcClient)
          break
        }

        case 'zksync': {
          const zksyncLiteClient = new ZksyncLiteClient({
            url: blockApi.url,
            http: http2,
            rateLimiter,
            retryHandler,
            logger,
          })
          blockClients.push(zksyncLiteClient)
          break
        }

        case 'starknet': {
          const starknetClient = new StarknetClient({
            url: blockApi.url,
            http: http2,
            rateLimiter,
            retryHandler,
            logger,
          })
          blockClients.push(starknetClient)
          break
        }
        case 'loopring':
        case 'degate3': {
          const loopringClient = new LoopringClient({
            url: blockApi.url,
            type: blockApi.type,
            http: http2,
            rateLimiter,
            retryHandler,
            logger,
          })
          blockClients.push(loopringClient)
          break
        }
        case 'fuel': {
          const fuelClient = new FuelClient({
            url: blockApi.url,
            http: http2,
            rateLimiter,
            retryHandler,
            logger,
          })
          blockClients.push(fuelClient)
          break
        }
        case 'starkex': {
          starkexClient = new StarkexClient(blockApi.apiKey, http, logger, {
            callsPerMinute: blockApi.callsPerMinute,
          })
          break
        }
        default:
          assertUnreachable(blockApi)
      }
    }
  }

  return new BlockProviders(blockClients, starkexClient, indexerClients)
}
