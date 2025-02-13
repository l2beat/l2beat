import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  BlobClient,
  BlobScanClient,
  type BlockClient,
  BlockIndexerClient,
  CelestiaRpcClient,
  CoingeckoClient,
  FuelClient,
  HttpClient,
  LoopringClient,
  PolkadotRpcClient,
  RpcClient,
  StarkexClient,
  StarknetClient,
  ZksyncLiteClient,
} from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import type { Config } from '../config/Config'

export interface Clients {
  block: BlockClient[]
  indexer: BlockIndexerClient[]
  starkex: StarkexClient | undefined
  loopring: LoopringClient | undefined
  degate: LoopringClient | undefined
  coingecko: CoingeckoClient
  blob: BlobClient | undefined
  blobscan: { daLayer: string; client: BlobScanClient }[]
  celestia: { daLayer: string; client: CelestiaRpcClient }[]
  avail: { daLayer: string; client: PolkadotRpcClient }[]
  getRpcClient: (chain: string) => RpcClient
  getStarknetClient: (chain: string) => StarknetClient
}

export function initClients(config: Config, logger: Logger): Clients {
  const http = new HttpClient()

  let starkexClient: StarkexClient | undefined
  let loopringClient: LoopringClient | undefined
  let degateClient: LoopringClient | undefined
  let ethereumClient: RpcClient | undefined
  let blobClient: BlobClient | undefined
  const blobscan = []
  const celestia = []
  const avail = []

  const starknetClients: StarknetClient[] = []
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
            http,
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
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(zksyncLiteClient)
          break
        }

        case 'starknet': {
          const client = new StarknetClient({
            sourceName: chain.name,
            url: blockApi.url,
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          blockClients.push(client)
          starknetClients.push(client)
          break
        }
        case 'loopring':
        case 'degate3': {
          const client = new LoopringClient({
            sourceName: blockApi.type,
            url: blockApi.url,
            type: blockApi.type,
            http,
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
            http,
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
            http,
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

  if (config.da) {
    for (const layer of config.da.layers) {
      switch (layer.type) {
        case 'ethereum': {
          const client = new BlobScanClient({
            callsPerMinute: layer.callsPerMinute,
            baseUrl: layer.url,
            retryStrategy: 'UNRELIABLE',
            sourceName: layer.name,
            logger,
            http,
          })
          blobscan.push({ daLayer: layer.name, client })
          break
        }

        case 'celestia': {
          const client = new CelestiaRpcClient({
            callsPerMinute: layer.callsPerMinute,
            url: layer.url,
            retryStrategy: 'RELIABLE',
            sourceName: layer.name,
            logger,
            http,
          })
          celestia.push({ daLayer: layer.name, client })
          blockClients.push(client)
          break
        }

        case 'avail': {
          const client = new PolkadotRpcClient({
            callsPerMinute: layer.callsPerMinute,
            url: layer.url,
            retryStrategy: 'RELIABLE',
            sourceName: layer.name,
            logger,
            http,
          })
          avail.push({ daLayer: layer.name, client })
          blockClients.push(client)
        }
      }
    }
  }

  const coingeckoClient = new CoingeckoClient({
    sourceName: 'coingeckoApi',
    apiKey: config.coingeckoApiKey,
    http,
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
      http,
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

  const getStarknetClient = (chain: string) => {
    const client = starknetClients.find((r) => r.chain === chain)
    assert(client, `${chain}: Starknet client not found`)
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
    blobscan,
    celestia,
    avail,
    getStarknetClient,
    getRpcClient,
  }
}
