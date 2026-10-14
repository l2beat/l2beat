import type { Env, Logger } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import {
  BeaconChainClient,
  type DaBlobProvider,
  EthereumDaProvider,
  type HttpClient,
  RpcClientCompat,
} from '@l2beat/shared'
import { assert, ProjectId } from '@l2beat/shared-pure'
import type { DataAvailabilityTrackingConfig } from '../../src/config/Config'

export interface PreviewBlockClient {
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<{ timestamp: number }>
}

export interface DaPreviewLayer {
  /** Layer name as used in config daLayer references */
  name: string
  batchSize: number
  startingBlock: number
  /** Undefined only for ethereum in db-cache-only mode */
  provider?: DaBlobProvider
  blockClient: PreviewBlockClient
}

export interface PreviewClients {
  blockLayers: DaPreviewLayer[]
}

export async function createPreviewClients(
  daConfig: DataAvailabilityTrackingConfig,
  ps: ProjectService,
  env: Env,
  logger: Logger,
  http: HttpClient,
  opts: { ethereumFromDbOnly: boolean },
): Promise<PreviewClients> {
  const blockLayers: DaPreviewLayer[] = []

  for (const layer of daConfig.blockLayers) {
    const ethereum = await ps.getProject({
      id: ProjectId('ethereum'),
      select: ['chainConfig'],
    })
    assert(ethereum, 'Ethereum project not found')
    const rpcApi = ethereum.chainConfig.apis.find((a) => a.type === 'rpc')
    const rpcClient = RpcClientCompat.create({
      url: env.string('ETHEREUM_RPC_URL', rpcApi?.url),
      chain: 'ethereum',
      callsPerMinute: env.integer(
        'ETHEREUM_RPC_CALLS_PER_MINUTE',
        rpcApi?.callsPerMinute ?? 120,
      ),
      retryStrategy: 'RELIABLE',
      http,
      logger,
    })

    let provider: DaBlobProvider | undefined
    if (!opts.ethereumFromDbOnly) {
      const beaconClient = new BeaconChainClient({
        sourceName: 'beaconApi',
        beaconApiUrl: layer.url,
        callsPerMinute: layer.callsPerMinute,
        retryStrategy: 'RELIABLE',
        http,
        logger,
      })
      provider = new EthereumDaProvider(beaconClient, rpcClient, layer.name)
    }

    blockLayers.push({
      name: layer.name,
      batchSize: layer.batchSize,
      startingBlock: layer.startingBlock,
      provider,
      blockClient: rpcClient,
    })
  }

  return { blockLayers }
}
