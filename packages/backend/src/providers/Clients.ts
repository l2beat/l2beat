import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  BlobClient,
  BlockClient,
  BlockIndexerClient,
  CoingeckoClient,
  FuelClient,
  HttpClient,
  HttpClient2,
  LoopringClient,
  RpcClient,
  StarkexClient,
  StarknetClient,
  ZksyncLiteClient,
} from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { Config } from '../config/Config'

export interface Clients {
  block: BlockClient[]
  indexer: BlockIndexerClient[]
  starkex: StarkexClient | undefined
  loopring: LoopringClient | undefined
  degate: LoopringClient | undefined
  coingecko: CoingeckoClient
  blob: BlobClient | undefined
  starknet: StarknetClient | undefined
  getRpcClient: (chain: string) => RpcClient
}

export function initClients(config: Config, logger: Logger): Clients {
  const http = new HttpClient()
  const http2 = new HttpClient2()

  let starkexClient: StarkexClient | undefined
  let loopringClient: LoopringClient | undefined
  let degateClient: LoopringClient | undefined
  let ethereumClient: RpcClient | undefined
  let blobClient: BlobClient | undefined
  let starknetClient: StarknetClient | undefined

  const blockClients: BlockClient[] = []
  const indexerClients: BlockIndexerClient[] = []
  const rpcClients: RpcClient[] = []

  for (const chain of config.chainConfig) {
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
      switch (blockApi.type) {
        case 'rpc': {
          const rpcClient = new RpcClient({
            sourceName: chain.name,
            url: blockApi.url,
            http: http2,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(rpcClient)
          rpcClients.push(rpcClient)
          if (chain.name === 'ethereum' && ethereumClient === undefined) {
            ethereumClient = rpcClient
          }
          break
        }

        case 'zksync': {
          const zksyncLiteClient = new ZksyncLiteClient({
            sourceName: 'zksynclite',
            url: blockApi.url,
            http: http2,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(zksyncLiteClient)
          break
        }

        case 'starknet': {
          const client = new StarknetClient({
            sourceName: 'starknet',
            url: blockApi.url,
            http: http2,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(client)
          starknetClient = client
          break
        }
        case 'loopring':
        case 'degate3': {
          const client = new LoopringClient({
            sourceName: blockApi.type,
            url: blockApi.url,
            type: blockApi.type,
            http: http2,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(client)
          blockApi.type === 'loopring'
            ? (loopringClient = client)
            : (degateClient = client)
          break
        }
        case 'fuel': {
          const fuelClient = new FuelClient({
            sourceName: 'fuel',
            url: blockApi.url,
            http: http2,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(fuelClient)
          break
        }
        case 'starkex': {
          starkexClient = new StarkexClient({
            sourceName: 'starkex',
            apiKey: blockApi.apiKey,
            http: http2,
            retryStrategy: blockApi.retryStrategy,
            logger,
            callsPerMinute: blockApi.callsPerMinute,
          })
          break
        }
        default:
          assertUnreachable(blockApi)
      }
    }
  }

  const coingeckoClient = new CoingeckoClient({
    sourceName: 'coingeckoApi',
    apiKey: config.coingeckoApiKey,
    http: http2,
    logger,
    callsPerMinute: config.coingeckoApiKey ? 400 : 10,
    retryStrategy: 'RELIABLE',
  })

  if (ethereumClient && config.beaconApi.url) {
    blobClient = new BlobClient({
      sourceName: 'beaconApi',
      beaconApiUrl: config.beaconApi.url,
      rpcClient: ethereumClient,
      logger,
      http: http2,
      callsPerMinute: config.beaconApi.callsPerMinute,
      timeout: config.beaconApi.timeout,
      retryStrategy: 'RELIABLE',
    })
  }

  const getRpcClient = (chain: string) => {
    const client = rpcClients.find((r) => r.chain === chain)
    assert(client, `${chain}: Client not found`)
    return client
  }

  return {
    block: blockClients,
    indexer: indexerClients,
    starkex: starkexClient,
    loopring: loopringClient,
    degate: degateClient,
    coingecko: coingeckoClient,
    blob: blobClient,
    starknet: starknetClient,
    getRpcClient,
  }
}
