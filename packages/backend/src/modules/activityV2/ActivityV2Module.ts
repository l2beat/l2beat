import { HttpClient, Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'

import { ActivityV2Controller } from '../../api/controllers/activity-v2/ActivityV2Controller'
import { createActivityV2Router } from '../../api/routers/ActivityV2Router'
import { Config } from '../../config'
import { DailyTransactionCountService } from '../../core/activity/DailyTransactionCountService'
import { DailyTransactionCountViewRefresher } from '../../core/activity/DailyTransactionCountViewRefresher'
import { TransactionCounter } from '../../core/activity/TransactionCounter'
import { TransactionCountingMonitor } from '../../core/activity/TransactionCountingMonitor'
import { Clock } from '../../core/Clock'
import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'
import { createTransactionCounters } from './createTransactionCounters'

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

  const counters = createTransactionCounters(
    config,
    logger,
    http,
    database,
    clock,
  )

  const viewRefresher = new DailyTransactionCountViewRefresher(
    counters,
    dailyCountViewRepository,
    clock,
    logger,
  )

  const transactionCountingMonitor = new TransactionCountingMonitor(
    counters,
    clock,
    logger,
  )

  const dailyCountService = new DailyTransactionCountService(
    counters,
    dailyCountViewRepository,
    logger,
  )

  const includedInApiProjectIds = getIncludedInApiProjectIds(
    counters,
    config,
    logger,
  )
  const activityController = new ActivityV2Controller(
    includedInApiProjectIds,
    dailyCountService,
  )
  const activityV2Router = createActivityV2Router(activityController)

  const start = () => {
    if (!config.syncEnabled) {
      return
    }

    logger = logger.for('ActivityV2Module')
    logger.info('Starting')

    counters.forEach((c) => c.start())
    viewRefresher.start()
    transactionCountingMonitor.start()

    logger.info('Started')
  }

  return {
    routers: [activityV2Router],
    start,
  }
}

function getIncludedInApiProjectIds(
  counters: TransactionCounter[],
  config: Config,
  logger: Logger,
): ProjectId[] {
  return counters
    .filter((counter) => {
      const explicitlyExcluded = config.projects.some(
        (p) =>
          p.projectId === counter.projectId &&
          p.transactionApi?.excludeFromActivityApi === true,
      )
      if (explicitlyExcluded) {
        logger.info(
          `Project ${counter.projectId.toString()} explicitly excluded from activity v2 api via config - will not be present in the response, but will continue syncing`,
        )
      }
      return !explicitlyExcluded
    })
    .map((c) => c.projectId)
}
