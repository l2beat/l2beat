import { Logger } from '@l2beat/backend-tools'
import {
  BigQueryClient,
  BigQueryProvider,
  BigQueryWrapper,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Clock } from '../../core/Clock'
import { HourlyIndexer } from '../../core/liveness/HourlyIndexer'
import { LivenessIndexer } from '../../core/liveness/LivenessIndexer'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { LivenessRepository } from '../../peripherals/database/LivenessRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'

export function createLivenessModule(
  config: Config,
  logger: Logger,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.liveness) {
    logger.info('Liveness module disabled')
    return
  }

  const indexerStateRepository = new IndexerStateRepository(database, logger)
  const livenessRepository = new LivenessRepository(database, logger)

  const bigQueryWrapper = new BigQueryWrapper({
    clientEmail: config.liveness.bigQuery.clientEmail,
    privateKey: config.liveness.bigQuery.privateKey,
    projectId: config.liveness.bigQuery.projectId,
  })
  const bigQueryProvider = new BigQueryProvider(bigQueryWrapper)
  const bigQueryClient = new BigQueryClient(bigQueryProvider)

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const liveness = new LivenessIndexer(
    logger,
    hourlyIndexer,
    config.projects,
    bigQueryClient,
    indexerStateRepository,
    livenessRepository,
    // TODO: figure out from where to start
    UnixTime.now().toStartOf('hour').add(-1, 'days'),
  )

  const start = async () => {
    await hourlyIndexer.start()
    await liveness.start()
  }

  return {
    start,
  }
}
