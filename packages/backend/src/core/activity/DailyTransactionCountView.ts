import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountRepository'
import { Clock } from '../Clock'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../SequenceProcessor'
import { decideAboutYesterday } from './decideAboutYesterday'
import { fillMissingCounts } from './fillMissingCounts'
import { groupByProjectId } from './groupByProjectId'
import { DailyTransactionCount } from './types'

export class DailyTransactionCountView {
  private readonly refreshQueue: TaskQueue<void>

  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly dailyTransactionCountRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.refreshQueue = new TaskQueue<void>(async () => {
      this.logger.info('Refresh started')
      await this.dailyTransactionCountRepository.refresh()
      // TODO: check sync correctness
      this.logger.info('Refresh finished')
    }, this.logger.for('refreshQueue'))
  }

  start() {
    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.on(ALL_PROCESSED_EVENT, () => {
        this.logger.info(
          `Received 'last reached' event for ${processor.id} - scheduling refresh`,
        )
        this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onEveryHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  async getDailyCounts(): Promise<Map<ProjectId, DailyTransactionCount[]>> {
    const allCounts =
      await this.dailyTransactionCountRepository.getDailyCounts()
    const projectCounts = groupByProjectId(allCounts)

    for (const [projectId, counts] of projectCounts) {
      const processor = this.processors.find(
        (p) => p.id === projectId.toString(),
      )
      if (!processor) {
        projectCounts.delete(projectId)
        this.logger.debug(
          `Skipping ${projectId.toString()} from daily counts - no processor found`,
        )
        continue
      }
      const lastReached = processor.isLastReached()
      const yesterday = UnixTime.now().toStartOf('day').add(-1, 'days')
      const decidedCounts = decideAboutYesterday(counts, yesterday, lastReached)
      const filledCounts = fillMissingCounts(decidedCounts)
      projectCounts.set(projectId, filledCounts)
    }

    return projectCounts
  }
}
