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
  RetryHandler,
  RpcClient2,
  StarkexClient,
  StarknetClient,
  ZksyncLiteClient,
} from '@l2beat/shared'
import { assertUnreachable } from '@l2beat/shared-pure'
import { Config } from '../config/Config'

export interface Clients {
  block: BlockClient[]
  indexer: BlockIndexerClient[]
  starkex: StarkexClient | undefined
  loopring: LoopringClient | undefined
  degate: LoopringClient | undefined
  coingecko: CoingeckoClient
  blob: BlobClient | undefined
  ethereum: RpcClient2 | undefined
}

export function initClients(config: Config, logger: Logger): Clients {
  const http = new HttpClient()
  const http2 = new HttpClient2()

  let starkexClient: StarkexClient | undefined
  let loopringClient: LoopringClient | undefined
  let degateClient: LoopringClient | undefined
  let ethereumClient: RpcClient2 | undefined
  let blobClient: BlobClient | undefined

  const blockClients: BlockClient[] = []
  const indexerClients: BlockIndexerClient[] = []

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
          if (chain.name === 'ethereum' && ethereumClient === undefined) {
            ethereumClient = rpcClient
          }
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
          const client = new LoopringClient({
            url: blockApi.url,
            type: blockApi.type,
            http: http2,
            rateLimiter,
            retryHandler,
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
          starkexClient = new StarkexClient({
            apiKey: blockApi.apiKey,
            http: http2,
            retryHandler,
            logger,
            rateLimiter,
          })
          break
        }
        default:
          assertUnreachable(blockApi)
      }
    }
  }

  const coingeckoClient = new CoingeckoClient({
    apiKey: config.coingeckoApiKey,
    http: http2,
    logger,
    rateLimiter: RateLimiter.COINGECKO(config.coingeckoApiKey),
    retryHandler: RetryHandler.RELIABLE_API(logger),
  })

  if (ethereumClient && config.beaconApi.url) {
    blobClient = new BlobClient({
      beaconApiUrl: config.beaconApi.url,
      rpcClient: ethereumClient,
      logger,
      http,
      rateLimiter: new RateLimiter({
        callsPerMinute: config.beaconApi.callsPerMinute,
      }),
      timeout: config.beaconApi.timeout,
      retryHandler: RetryHandler.RELIABLE_API(logger),
    })
  }

  return {
    block: blockClients,
    indexer: indexerClients,
    starkex: starkexClient,
    loopring: loopringClient,
    degate: degateClient,
    coingecko: coingeckoClient,
    blob: blobClient,
    ethereum: ethereumClient,
  }
}
