import type { Env, Logger } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import {
  AvailDaProvider,
  BeaconChainClient,
  CelestiaDaProvider,
  CelestiaRpcClient,
  type DaBlobProvider,
  EigenApiClient,
  EthereumDaProvider,
  type HttpClient,
  PolkadotRpcClient,
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
  /** Layer name as used in config daLayer references ('ethereum' | 'celestia' | 'avail') */
  name: string
  batchSize: number
  startingBlock: number
  /** Undefined only for ethereum in db-cache-only mode */
  provider?: DaBlobProvider
  blockClient: PreviewBlockClient
}

export interface PreviewClients {
  blockLayers: DaPreviewLayer[]
  eigen?: EigenApiClient
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
    switch (layer.type) {
      case 'ethereum': {
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
            timeout: layer.timeout,
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
        break
      }
      case 'celestia': {
        const client = new CelestiaRpcClient({
          url: layer.url,
          callsPerMinute: layer.callsPerMinute,
          timeout: layer.timeout,
          retryStrategy: 'RELIABLE',
          sourceName: layer.name,
          http,
          logger,
        })
        blockLayers.push({
          name: layer.name,
          batchSize: layer.batchSize,
          startingBlock: layer.startingBlock,
          provider: new CelestiaDaProvider(client, layer.name),
          blockClient: client,
        })
        break
      }
      case 'avail': {
        const client = new PolkadotRpcClient({
          url: layer.url,
          callsPerMinute: layer.callsPerMinute,
          retryStrategy: 'RELIABLE',
          sourceName: layer.name,
          http,
          logger,
        })
        blockLayers.push({
          name: layer.name,
          batchSize: layer.batchSize,
          startingBlock: layer.startingBlock,
          provider: new AvailDaProvider(client, layer.name),
          blockClient: client,
        })
        break
      }
    }
  }

  let eigen: EigenApiClient | undefined
  const eigenLayer = daConfig.timestampLayers.find((l) => l.type === 'eigen-da')
  if (eigenLayer) {
    assert(eigenLayer.perProjectUrl, 'EigenDA per project url is required')
    eigen = new EigenApiClient({
      sourceName: 'eigen',
      url: eigenLayer.url,
      perProjectUrl: eigenLayer.perProjectUrl,
      callsPerMinute: eigenLayer.callsPerMinute,
      retryStrategy: 'RELIABLE',
      http,
      logger,
    })
  }

  return { blockLayers, eigen }
}
