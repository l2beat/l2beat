import { Logger } from '@l2beat/backend-tools'
import { notUndefined } from '@l2beat/shared-pure'
import { ethers } from 'ethers'

import { Config } from '../../config'
import { Database } from '../../peripherals/database/Database'
import { IndexerStateRepository } from '../../peripherals/database/repositories/IndexerStateRepository'
import { RpcClient } from '../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { LivenessIndexer } from '../liveness/LivenessIndexer'
import { LivenessRepository } from '../liveness/repositories/LivenessRepository'
import { LineaFinalityAnalyzer } from './analyzers/LineaFinalityAnalyzer'
import { zkSyncEraFinalityAnalyzer } from './analyzers/zkSyncEraFinalityAnalyzer'
import { FinalityController } from './api/FinalityController'
import { createFinalityRouter } from './api/FinalityRouter'
import { FinalityIndexer } from './FinalityIndexer'
import { FinalityRepository } from './repositories/FinalityRepository'

export function createFinalityModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
  livenessIndexer?: LivenessIndexer,
): ApplicationModule | undefined {
  if (!config.finality) {
    logger.info('Finality module disabled')
    return
  }

  if (!livenessIndexer) {
    logger.error('To run finality you have to run Liveness')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessRepository = new LivenessRepository(database, logger)
  const finalityRepository = new FinalityRepository(database, logger)

  const finalityController = new FinalityController(
    livenessRepository,
    finalityRepository,
    indexerStateRepository,
    config.projects,
    clock,
  )
  const finalityRouter = createFinalityRouter(finalityController)

  const ethereumProvider = new ethers.providers.JsonRpcProvider(
    config.finality.ethereumProviderUrl,
  )
  const ethereumRPC = new RpcClient(ethereumProvider, logger)

  const lineaAnalyzer = new LineaFinalityAnalyzer(
    ethereumRPC,
    livenessRepository,
  )

  const zkSyncEraAnalyzer = new zkSyncEraFinalityAnalyzer(
    ethereumRPC,
    livenessRepository,
  )

  const runtimeConfigurations = config.finality.indexerConfigurations
    .map((configuration) => {
      if (configuration.type === 'Linea') {
        return {
          projectId: configuration.projectId,
          analyzer: lineaAnalyzer,
          minTimestamp: configuration.minTimestamp,
        }
      } else if (configuration.type === 'zkSyncEra') {
        return {
          projectId: configuration.projectId,
          analyzer: zkSyncEraAnalyzer,
          minTimestamp: configuration.minTimestamp,
        }
      }
    })
    .filter(notUndefined)

  const finalityIndexers = runtimeConfigurations.map(
    (runtimeConfiguration) =>
      new FinalityIndexer(
        logger,
        livenessIndexer,
        indexerStateRepository,
        finalityRepository,
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
    routers: [finalityRouter],
  }
}
