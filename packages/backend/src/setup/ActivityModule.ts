import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'
import { ActivityController } from '../api/controllers/activity/ActivityController'
import { createActivityRouter } from '../api/routers/ActivityRouter'

import { Config } from '../config'
import { DailyCountView } from '../core/activity/DailyCountView'
import { createSequenceProcessors } from '../core/activity/processors/createProcessors'
import { Clock } from '../core/Clock'
import { SequenceProcessor } from '../core/SequenceProcessor'
import { Database } from '../peripherals/database/shared/Database'
import { DailyCountRepository } from '../peripherals/database/transactions/DailyCountRepository'

export function getActivityModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
) {
  if (!config.transactionCountSync) {
    return undefined
  }

  const processors: SequenceProcessor[] = createSequenceProcessors(
    config,
    logger,
    http,
    database,
    clock,
  )
  const dailyCountRepository = new DailyCountRepository(database, logger)
  const dailyCountView = new DailyCountView(
    processors,
    dailyCountRepository,
    clock,
    logger,
  )
  const activityController = new ActivityController(
    processors
      .filter((processor) =>
        config.projects.some(
          (p) =>
            p.projectId.toString() === processor.id &&
            !p.transactionApi?.excludeFromActivityApi,
        ),
      )
      .map((p) => ProjectId(p.id)),
    dailyCountView,
  )
  const router = createActivityRouter(activityController)

  const start = () => {
    logger.info('Starting Activity Module')
    processors.forEach((p) => p.start())
    dailyCountView.start()
    logger.info('Started Activity Module')
  }

  return {
    router,
    start,
  }
}
