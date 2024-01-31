import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Config } from '../../config/Config'
import { Clock } from '../../core/Clock'
import { TaskQueue } from '../../core/queue/TaskQueue'
import { TvlDatabase } from './types'

interface Table {
  deleteHourlyUntil: (timestamp: UnixTime) => Promise<number>
  deleteSixHourlyUntil: (timestamp: UnixTime) => Promise<number>
}

export class TvlCleaner {
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly tables: Table[],
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      () => this.clean(),
      this.logger.for('taskQueue'),
      {
        metricsId: TvlCleaner.name,
      },
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Started')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async clean() {
    const hourlyDeletionBoundary =
      this.clock._TVL_ONLY_getHourlyDeletionBoundary()
    const sixHourlyDeletionBoundary =
      this.clock._TVL_ONLY_getSixHourlyDeletionBoundary()

    for (const table of this.tables) {
      await table.deleteHourlyUntil(hourlyDeletionBoundary)
      await table.deleteSixHourlyUntil(sixHourlyDeletionBoundary)
    }
  }
}

export function initializeTvlCleaner(
  config: Config,
  logger: Logger,
  clock: Clock,
  database: TvlDatabase,
): TvlCleaner | undefined {
  if (!config.tvlCleanerEnabled) {
    return undefined
  }

  const tables = [database.reportRepository]

  return new TvlCleaner(clock, logger, tables)
}
