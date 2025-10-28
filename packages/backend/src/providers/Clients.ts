import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  AvailWsClient,
  BeaconChainClient,
  type BlockClient,
  BlockIndexerClient,
  CelestiaRpcClient,
  CoingeckoClient,
  EigenApiClient,
  FuelClient,
  HttpClient,
  type LogsClient,
  LoopringClient,
  MulticallV3Client,
  NearClient,
  PolkadotRpcClient,
  RpcClient,
  StarkexClient,
  StarknetClient,
  type SvmBlockClient,
  SvmRpcClient,
  VoyagerClient,
  ZksyncLiteClient,
} from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import type { Config } from '../config/Config'

export interface Clients {
  block: BlockClient[]
  logs: LogsClient[]
  svmBlock: SvmBlockClient[]
  indexer: BlockIndexerClient[]
  voyager: VoyagerClient | undefined
  starkex: StarkexClient | undefined
  loopring: LoopringClient | undefined
  degate: LoopringClient | undefined
  coingecko: CoingeckoClient
  beacon: BeaconChainClient | undefined
  celestia: CelestiaRpcClient | undefined
  celestiaDaBeat: CelestiaRpcClient | undefined
  avail: PolkadotRpcClient | undefined
  availWs: AvailWsClient | undefined
  eigen: EigenApiClient | undefined
  getRpcClient: (chain: string) => RpcClient
  getStarknetClient: (chain: string) => StarknetClient
  rpcClients: RpcClient[]
  starknetClients: StarknetClient[]
  near: NearClient | undefined
}

export function initClients(config: Config, logger: Logger): Clients {
  const http = new HttpClient()

  let starkexClient: StarkexClient | undefined
  let voyagerClient: VoyagerClient | undefined
  let loopringClient: LoopringClient | undefined
  let degateClient: LoopringClient | undefined
  let ethereumClient: RpcClient | undefined
  let beaconChainClient: BeaconChainClient | undefined
  let celestia: CelestiaRpcClient | undefined
  let celestiaDaBeat: CelestiaRpcClient | undefined
  let avail: PolkadotRpcClient | undefined
  let availWs: AvailWsClient | undefined
  let near: NearClient | undefined
  let eigen: EigenApiClient | undefined

  const starknetClients: StarknetClient[] = []
  const blockClients: BlockClient[] = []
  const logsClients: LogsClient[] = []
  const svmBlockClients: SvmBlockClient[] = []
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
          const multicallClient = blockApi.multicallV3
            ? new MulticallV3Client(
                blockApi.multicallV3.address,
                blockApi.multicallV3.sinceBlock,
                500,
              )
            : undefined
          const rpcClient = new RpcClient({
            chain: chain.name,
            url: blockApi.url,
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
            multicallClient,
          })
          blockClients.push(rpcClient)
          logsClients.push(rpcClient)
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
        case 'svm-rpc': {
          const client = new SvmRpcClient({
            sourceName: chain.name,
            url: blockApi.url,
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger,
          })
          svmBlockClients.push(client)
          break
        }
        default:
          assertUnreachable(blockApi)
      }
    }
  }

  if (config.da) {
    for (const layer of config.da.blockLayers) {
      switch (layer.type) {
        case 'celestia': {
          celestia = new CelestiaRpcClient({
            callsPerMinute: layer.callsPerMinute,
            url: layer.url,
            retryStrategy: 'RELIABLE',
            sourceName: layer.name,
            logger,
            http,
          })
          blockClients.push(celestia)
          break
        }

        case 'avail': {
          avail = new PolkadotRpcClient({
            callsPerMinute: layer.callsPerMinute,
            url: layer.url,
            retryStrategy: 'RELIABLE',
            sourceName: layer.name,
            logger,
            http,
          })
          blockClients.push(avail)
        }
      }
    }
    for (const layer of config.da.timestampLayers) {
      switch (layer.type) {
        case 'eigen-da': {
          const perProjectUrl = layer.perProjectUrl
          assert(perProjectUrl, 'EigenDA per project url is required')
          eigen = new EigenApiClient({
            sourceName: 'eigen',
            url: layer.url,
            perProjectUrl,
            http,
            logger,
            callsPerMinute: layer.callsPerMinute,
            retryStrategy: 'RELIABLE',
          })
          break
        }
        default:
          assertUnreachable(layer.type)
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

  if (config.activity && config.activity.voyagerApiKey) {
    voyagerClient = new VoyagerClient({
      sourceName: 'voyager',
      apiKey: config.activity?.voyagerApiKey,
      http,
      logger,
      callsPerMinute: 100,
      retryStrategy: 'RELIABLE',
    })
  }

  if (config.beaconApi.url) {
    beaconChainClient = new BeaconChainClient({
      sourceName: 'beaconApi',
      beaconApiUrl: config.beaconApi.url,
      logger,
      http,
      callsPerMinute: config.beaconApi.callsPerMinute,
      timeout: config.beaconApi.timeout,
      retryStrategy: 'RELIABLE',
    })
  }

  if (config.daBeat) {
    near = new NearClient({
      sourceName: 'near',
      nearApiUrl: config.daBeat.nearRpcUrl,
      http,
      retryStrategy: 'RELIABLE',
      logger,
      callsPerMinute: 100,
    })
    celestiaDaBeat = new CelestiaRpcClient({
      callsPerMinute: config.daBeat.celestiaCallsPerMinute,
      url: config.daBeat.celestiaApiUrl,
      retryStrategy: 'RELIABLE',
      sourceName: 'celestia',
      logger,
      http,
    })
    availWs = new AvailWsClient(config.daBeat.availWsUrl)
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
    logs: logsClients,
    svmBlock: svmBlockClients,
    indexer: indexerClients,
    starkex: starkexClient,
    loopring: loopringClient,
    degate: degateClient,
    coingecko: coingeckoClient,
    beacon: beaconChainClient,
    celestia,
    celestiaDaBeat,
    eigen,
    avail,
    availWs,
    near,
    getStarknetClient,
    getRpcClient,
    rpcClients,
    starknetClients,
    voyager: voyagerClient,
  }
}
