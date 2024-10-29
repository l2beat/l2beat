import { Logger } from '@l2beat/backend-tools'
import { assert, assertUnreachable, notUndefined } from '@l2beat/shared-pure'

import { BlobClient } from '@l2beat/shared'
import { Config } from '../../config'
import { FinalityProjectConfig } from '../../config/features/finality'
import { ClientClass, Peripherals } from '../../peripherals/Peripherals'
import { DegateClient } from '../../peripherals/degate'
import { LoopringClient } from '../../peripherals/loopring/LoopringClient'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { StarknetClient } from '../../peripherals/starknet/StarknetClient'
import { ApplicationModule } from '../ApplicationModule'
import { TrackedTxsIndexer } from '../tracked-txs/TrackedTxsIndexer'
import { FinalityIndexer } from './FinalityIndexer'
import { LineaT2IAnalyzer } from './analyzers/LineaT2IAnalyzer'
import { LoopringT2IAnalyzer } from './analyzers/LoopringT2IAnalyzer'
import { ScrollT2IAnalyzer } from './analyzers/ScrollT2IAnalyzer'
import { StarknetT2IAnalyzer } from './analyzers/StarknetT2IAnalyzer'
import { ZkSyncLiteT2IAnalyzer } from './analyzers/ZkSyncLiteT2IAnalyzer'
import { ArbitrumT2IAnalyzer } from './analyzers/arbitrum/ArbitrumT2IAnalyzer'
import { OpStackStateUpdateAnalyzer } from './analyzers/opStack/OpStackStateUpdateAnalyzer'
import { OpStackT2IAnalyzer } from './analyzers/opStack/OpStackT2IAnalyzer'
import { PolygonZkEvmT2IAnalyzer } from './analyzers/polygon-zkevm/PolygonZkevmT2IAnalyzer'
import { zkSyncEraT2IAnalyzer } from './analyzers/zkSyncEraT2IAnalyzer'
import { FinalityConfig } from './types/FinalityConfig'

export function createFinalityModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  trackedTxsIndexer: TrackedTxsIndexer | undefined,
): ApplicationModule | undefined {
  if (!config.finality) {
    logger.info('Finality module disabled')
    return
  }

  if (!trackedTxsIndexer) {
    logger.error('To run finality you have to run tracked transactions module')
    return
  }

  const ethereumClient = peripherals.getClient(RpcClient, {
    url: config.finality.ethereumProviderUrl,
    callsPerMinute: config.finality.ethereumProviderCallsPerMinute,
    chain: 'ethereum',
  })

  const blobClient = peripherals.getClient(BlobClient, {
    beaconApiUrl: config.finality.beaconApiUrl,
    rpcUrl: config.finality.ethereumProviderUrl,
    callsPerMinute: config.finality.beaconApiCPM,
    timeout: config.finality.beaconApiTimeout,
  })

  const runtimeConfigurations = initializeConfigurations(
    ethereumClient,
    blobClient,
    logger,
    config.finality.configurations,
    peripherals,
  )

  const finalityIndexers = runtimeConfigurations.map(
    (runtimeConfiguration) =>
      new FinalityIndexer(
        logger,
        trackedTxsIndexer,
        peripherals.database,
        runtimeConfiguration,
      ),
  )

  const start = async () => {
    logger = logger.for('FinalityModule')
    logger.info('Starting...')

    for (const finalityIndexer of finalityIndexers) {
      await finalityIndexer.start()
    }
  }

  return {
    start,
  }
}

function initializeConfigurations(
  ethereumRPC: RpcClient,
  blobClient: BlobClient,
  logger: Logger,
  configs: FinalityProjectConfig[],
  peripherals: Peripherals,
): FinalityConfig[] {
  return configs
    .map((configuration): FinalityConfig | undefined => {
      switch (configuration.type) {
        case 'Linea':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new LineaT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                getL2Rpc(configuration, peripherals, RpcClient),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'zkSyncEra':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new zkSyncEraT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'OPStack-blob':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new OpStackT2IAnalyzer(
                blobClient,
                logger,
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                {
                  l2BlockTimeSeconds: configuration.l2BlockTimeSeconds,
                  genesisTimestamp: configuration.genesisTimestamp,
                },
              ),
              stateUpdate: new OpStackStateUpdateAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                configuration.l2BlockTimeSeconds,
                getL2Rpc(configuration, peripherals, RpcClient),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'Arbitrum':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new ArbitrumT2IAnalyzer(
                blobClient,
                logger,
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'Scroll':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new ScrollT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'zkSyncLite':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new ZkSyncLiteT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'Starknet':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new StarknetT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                getL2Rpc(configuration, peripherals, StarknetClient),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'OPStack':
          return
        case 'Loopring':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new LoopringT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                getL2Rpc(configuration, peripherals, LoopringClient),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'Degate':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new LoopringT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                getL2Rpc(configuration, peripherals, DegateClient),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'PolygonZkEvm':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new PolygonZkEvmT2IAnalyzer(
                ethereumRPC,
                peripherals.database,
                configuration.projectId,
                getL2Rpc(configuration, peripherals, RpcClient),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        default:
          assertUnreachable(configuration)
      }
    })
    .filter(notUndefined)
}

function getL2Rpc<Client, Options>(
  configuration: FinalityProjectConfig,
  peripherals: Peripherals,
  clientClass: ClientClass<Client, Options>,
) {
  assert(
    configuration.url,
    `${configuration.projectId.toString()}: L2 provider URL is not defined`,
  )

  return peripherals.getClient(clientClass, {
    url: configuration.url,
    callsPerMinute: configuration.callsPerMinute,
  } as Options)
}
