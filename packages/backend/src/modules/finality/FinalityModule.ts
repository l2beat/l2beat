import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, assertUnreachable, notUndefined } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { FinalityProjectConfig } from '../../config/features/finality'
import type { Providers } from '../../providers/Providers'
import type { ApplicationModule } from '../ApplicationModule'
import type { TrackedTxsIndexer } from '../tracked-txs/TrackedTxsIndexer'
import { FinalityIndexer } from './FinalityIndexer'
import { LoopringT2IAnalyzer } from './analyzers/LoopringT2IAnalyzer'
import { ScrollT2IAnalyzer } from './analyzers/ScrollT2IAnalyzer'
import { StarknetT2IAnalyzer } from './analyzers/StarknetT2IAnalyzer'
import { ZkSyncLiteT2IAnalyzer } from './analyzers/ZkSyncLiteT2IAnalyzer'
import { ArbitrumT2IAnalyzer } from './analyzers/arbitrum/ArbitrumT2IAnalyzer'
import { LineaT2IAnalyzer } from './analyzers/linea/LineaT2IAnalyzer'
import { OpStackStateUpdateAnalyzer } from './analyzers/opStack/OpStackStateUpdateAnalyzer'
import { OpStackT2IAnalyzer } from './analyzers/opStack/OpStackT2IAnalyzer'
import { PolygonZkEvmT2IAnalyzer } from './analyzers/polygon-zkevm/PolygonZkevmT2IAnalyzer'
import { zkSyncEraT2IAnalyzer } from './analyzers/zkSyncEraT2IAnalyzer'
import type { FinalityConfig } from './types/FinalityConfig'

export function createFinalityModule(
  config: Config,
  logger: Logger,
  database: Database,
  providers: Providers,
  trackedTxsIndexer: TrackedTxsIndexer | undefined,
): ApplicationModule | undefined {
  if (!config.finality) {
    logger.info('Finality module disabled')
    return
  }

  logger = logger.tag({ feature: 'finality', module: 'finality' })

  if (!trackedTxsIndexer) {
    logger.error('To run finality you have to run tracked transactions module')
    return
  }

  const runtimeConfigurations = initializeConfigurations(
    config.finality.configurations,
    providers,
    database,
    logger,
  )

  const finalityIndexers = runtimeConfigurations.map(
    (runtimeConfiguration) =>
      new FinalityIndexer(
        logger,
        trackedTxsIndexer,
        database,
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
  configs: FinalityProjectConfig[],
  providers: Providers,
  database: Database,
  logger: Logger,
): FinalityConfig[] {
  const ethereumClient = providers.clients.getRpcClient('ethereum')

  const loopringClient = providers.clients.loopring
  assert(loopringClient, 'Loopring client not defined')

  const degateClient = providers.clients.degate
  assert(degateClient, 'Degate client not defined')

  const blobProvider = providers.blob?.getBlobProvider()
  assert(blobProvider, 'Blob client is required for finality module')

  return configs
    .map((configuration): FinalityConfig | undefined => {
      switch (configuration.type) {
        case 'Linea':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new LineaT2IAnalyzer(
                blobProvider,
                ethereumClient,
                database,
                configuration.projectId,
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
                ethereumClient,
                database,
                configuration.projectId,
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'OPStack':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new OpStackT2IAnalyzer(
                blobProvider,
                logger,
                ethereumClient,
                database,
                configuration.projectId,
                {
                  l2BlockTimeSeconds: configuration.l2BlockTimeSeconds,
                  genesisTimestamp: configuration.genesisTimestamp,
                },
              ),
              stateUpdate: new OpStackStateUpdateAnalyzer(
                ethereumClient,
                database,
                configuration.projectId,
                configuration.l2BlockTimeSeconds,
                providers.clients.getRpcClient(configuration.projectId),
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
                blobProvider,
                logger,
                ethereumClient,
                database,
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
                ethereumClient,
                database,
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
                ethereumClient,
                database,
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
                ethereumClient,
                database,
                configuration.projectId,
                providers.clients.getStarknetClient(configuration.projectId),
              ),
            },
            minTimestamp: configuration.minTimestamp,
            stateUpdateMode: configuration.stateUpdate,
          }
        case 'Loopring':
          return {
            projectId: configuration.projectId,
            analyzers: {
              timeToInclusion: new LoopringT2IAnalyzer(
                ethereumClient,
                database,
                configuration.projectId,
                loopringClient,
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
                ethereumClient,
                database,
                configuration.projectId,
                degateClient,
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
                ethereumClient,
                database,
                configuration.projectId,
                providers.clients.getRpcClient(configuration.projectId),
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
