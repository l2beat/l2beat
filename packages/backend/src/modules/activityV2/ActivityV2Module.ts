import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { ActivityV2Controller } from '../../api/controllers/activity-v2/ActivityV2Controller'
import { createActivityV2Router } from '../../api/routers/ActivityV2Router'
import { Config } from '../../config'
import { DailyTransactionCountService } from '../../core/activity/DailyTransactionCountService'
import { Clock } from '../../core/Clock'
import { SequenceProcessor } from '../../core/SequenceProcessor'
import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'
import { createSequenceProcessors } from './createSequenceProcessors'

export function createActivityV2Module(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.activityV2) {
    return
  }

  const dailyCountViewRepository = new DailyTransactionCountViewRepository(
    database,
    logger,
  )

  const processors: SequenceProcessor[] = createSequenceProcessors(
    config,
    logger,
    http,
    database,
    clock,
  )
  const dailyCountService = new DailyTransactionCountService(
    processors,
    dailyCountViewRepository,
    clock,
    logger,
  )

  const activityController = new ActivityV2Controller(
    processors
      .filter((processor) =>
        config.projects.some(
          (p) =>
            p.projectId.toString() === processor.id &&
            !p.transactionApi?.excludeFromActivityApi,
        ),
      )
      .map((p) => ProjectId(p.id)),
    dailyCountService,
  )
  const activityV2Router = createActivityV2Router(activityController)

  const start = () => {
    if (!config.syncEnabled) {
      return
    }

    logger = logger.for('ActivityV2Module')
    logger.info('Starting')

    processors.forEach((p) => p.start())
    dailyCountService.start()

    logger.info('Started')
  }

  return {
    routers: [activityV2Router],
    start,
  }
}
