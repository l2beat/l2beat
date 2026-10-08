import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  type AztecBlockClient,
  AztecRpcClient,
  BeaconChainClient,
  type BlockClient,
  BlockIndexerClient,
  CoingeckoClient,
  DuneClient,
  FuelClient,
  HttpClient,
  type IRpcClient,
  LighterClient,
  type LogsClient,
  MulticallV3Client,
  type RetryHandlerVariant,
  RpcClient,
  RpcClientCompat,
  RpcMetricsAggregator,
  StarkexClient,
  StarknetClient,
  type SvmBlockClient,
  SvmRpcClient,
  toRetryOptions,
  VoyagerClient,
  withRetries,
} from '@l2beat/shared'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import type { Config } from '../config/Config'

export interface Clients {
  block: BlockClient[]
  logs: LogsClient[]
  svmBlock: SvmBlockClient[]
  aztecBlock: AztecBlockClient[]
  indexer: BlockIndexerClient[]
  voyager: VoyagerClient | undefined
  lighter: LighterClient | undefined
  starkex: StarkexClient | undefined
  coingecko: CoingeckoClient
  beacon: BeaconChainClient | undefined
  /** Ethereum, for following the head: see `LiveBlobsTrackingConfig.rpc` */
  liveBlobsRpc: IRpcClient | undefined
  getRpcClient: (chain: string) => IRpcClient
  getStarknetClient: (chain: string) => StarknetClient
  rpcClients: IRpcClient[]
  rpcMetricsAggregator: RpcMetricsAggregator
  starknetClients: StarknetClient[]
  dune: DuneClient | undefined
}

export function initClients(config: Config, logger: Logger): Clients {
  const http = new HttpClient()
  const rpcMetricsAggregator = new RpcMetricsAggregator({
    logger: logger.for(RpcMetricsAggregator.name),
  })
  function createRpcClient(options: {
    chain: string
    url: string
    callsPerMinute: number
    retryStrategy: RetryHandlerVariant
    logger: Logger
    multicallClient?: MulticallV3Client
    timeout?: number
  }): IRpcClient {
    return config.newClientsEnabled
      ? RpcClientCompat.create({ ...options, http, rpcMetricsAggregator })
      : new RpcClient({
          ...options,
          http,
          rpcMetrics: rpcMetricsAggregator.createRecorder({
            rpcChain: options.chain,
            rpcClient: RpcClient.name,
          }),
        })
  }

  let starkexClient: StarkexClient | undefined
  let voyagerClient: VoyagerClient | undefined
  let ethereumClient: IRpcClient | undefined
  let beaconChainClient: BeaconChainClient | undefined
  let liveBlobsRpc: IRpcClient | undefined
  let dune: DuneClient | undefined

  const starknetClients: StarknetClient[] = []
  const blockClients: BlockClient[] = []
  const logsClients: LogsClient[] = []
  const svmBlockClients: SvmBlockClient[] = []
  const aztecBlockClients: AztecBlockClient[] = []
  const indexerClients: BlockIndexerClient[] = []
  const rpcClients: IRpcClient[] = []

  for (const chain of config.chainConfig) {
    const chainLogger = logger.tag({ chain: chain.name })
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
          const rpcClient = createRpcClient({
            chain: chain.name,
            url: blockApi.url,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger: chainLogger,
            multicallClient,
            timeout: blockApi.timeout,
          })
          blockClients.push(rpcClient)
          logsClients.push(rpcClient)
          rpcClients.push(rpcClient)
          if (chain.name === 'ethereum' && ethereumClient === undefined) {
            ethereumClient = rpcClient
          }
          break
        }

        case 'starknet': {
          const client = new StarknetClient({
            sourceName: chain.name,
            url: blockApi.url,
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger: chainLogger,
          })
          blockClients.push(client)
          starknetClients.push(client)
          break
        }
        case 'fuel': {
          const fuelClient = new FuelClient({
            sourceName: 'fuel',
            url: blockApi.url,
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger: chainLogger,
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
            logger: chainLogger,
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
            logger: chainLogger,
          })
          svmBlockClients.push(client)
          break
        }
        case 'aztec-rpc': {
          const client = new AztecRpcClient({
            sourceName: chain.name,
            url: blockApi.url,
            http,
            callsPerMinute: blockApi.callsPerMinute,
            retryStrategy: blockApi.retryStrategy,
            logger: chainLogger,
          })
          aztecBlockClients.push(client)
          break
        }
        default:
          assertUnreachable(blockApi)
      }
    }
  }

  if (config.da && config.da.liveBlobs) {
    liveBlobsRpc = createRpcClient({
      chain: 'ethereum',
      ...config.da.liveBlobs.rpc,
      // The newest block reaches each node behind a load balancer at its
      // own pace: the next node asked has it a moment later
      retryStrategy: 'FAST',
      logger: logger.tag({ chain: 'ethereum', feature: 'liveBlobs' }),
    })
  }

  if (config.trackedTxsConfig && config.trackedTxsConfig.duneApiKey) {
    const retryOptions = toRetryOptions('RELIABLE')
    dune = withRetries(
      new DuneClient({
        http: http,
        apiKey: config.trackedTxsConfig.duneApiKey,
      }),
      {
        initialTimeoutMs: retryOptions.initialRetryDelayMs,
        maxAttempts: retryOptions.maxRetries,
        maxTimeoutMs: retryOptions.maxRetryDelayMs,
        logger,
      },
    )
  }

  const coingeckoClient = new CoingeckoClient({
    sourceName: 'coingeckoApi',
    apiKey: config.coingeckoApiKey,
    apiUrl: config.coingeckoApiUrl,
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

  const lighterClient = new LighterClient({
    sourceName: 'lighter',
    http,
    logger,
    callsPerMinute: 100,
    retryStrategy: 'RELIABLE',
  })

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
    aztecBlock: aztecBlockClients,
    indexer: indexerClients,
    starkex: starkexClient,
    coingecko: coingeckoClient,
    beacon: beaconChainClient,
    liveBlobsRpc,
    getStarknetClient,
    getRpcClient,
    rpcClients,
    rpcMetricsAggregator,
    starknetClients,
    voyager: voyagerClient,
    lighter: lighterClient,
    dune,
  }
}
