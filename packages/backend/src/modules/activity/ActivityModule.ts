import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'

import { ActivityController } from '../../api/controllers/activity/ActivityController'
import { createActivityRouter } from '../../api/routers/ActivityRouter'
import { Config } from '../../config'
import { ActivityConfig } from '../../config/Config'
import { DailyTransactionCountViewRefresher } from '../../core/activity/DailyTransactionCountViewRefresher'
import { TransactionCounter } from '../../core/activity/TransactionCounter'
import { TransactionCountingMonitor } from '../../core/activity/TransactionCountingMonitor'
import { Clock } from '../../core/Clock'
import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity/DailyTransactionCountViewRepository'
import { Database } from '../../peripherals/database/shared/Database'
import { ApplicationModule } from '../ApplicationModule'
import { createTransactionCounters } from './createTransactionCounters'

export function createActivityModule(
  config: Config,
  logger: Logger,
  http: HttpClient,
  database: Database,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.activity) {
    logger.info('Activity module disabled')
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

  const includedInApiProjectIds = getIncludedInApiProjectIds(
    counters,
    config.activity,
    logger,
  )
  const activityController = new ActivityController(
    includedInApiProjectIds,
    counters,
    dailyCountViewRepository,
    clock,
  )
  const activityV2Router = createActivityRouter(activityController, config)

  const start = async () => {
    logger = logger.for('ActivityModule')
    logger.info('Starting')
    await Promise.all(counters.map((c) => c.start()))
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
  activity: ActivityConfig,
  logger: Logger,
): ProjectId[] {
  return counters
    .filter((counter) => {
      return shouldCounterBeIncluded(counter, activity, logger)
    })
    .map((c) => c.projectId)
}

export function shouldCounterBeIncluded(
  counter: TransactionCounter,
  activity: ActivityConfig,
  logger: Logger,
) {
  const isExcludedInEnv = activity.projectsExcludedFromAPI.some(
    (p) => p === counter.projectId.toString(),
  )
  if (isExcludedInEnv) {
    logger.info(
      `Project ${counter.projectId.toString()} excluded from activity v2 api via .env - will not be present in the response, but will continue syncing`,
    )
    return false
  }

  return true
}
