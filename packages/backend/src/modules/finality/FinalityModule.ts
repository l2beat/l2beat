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

  const runtimeConfigurations = config.projects
    .map((p) => {
      if (p.finalityConfig?.type === 'Linea') {
        return {
          projectId: p.projectId,
          analyzer: lineaAnalyzer,
        }
      }
    })
    .filter(notUndefined)

  const finalityIndexer = new FinalityIndexer(
    logger,
    livenessIndexer,
    indexerStateRepository,
    finalityRepository,
    runtimeConfigurations,
  )

  const isIndexerEnabled = config.finality.indexerEnabled

  const start = async () => {
    logger = logger.for('FinalityModule')
    logger.info('Starting...')

    if (isIndexerEnabled) {
      await finalityIndexer.start()
    }
  }

  return {
    start,
    routers: [finalityRouter],
  }
}
