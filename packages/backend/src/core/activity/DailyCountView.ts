import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import { DailyCountRepository } from '../../peripherals/database/transactions/DailyCountRepository'
import { Clock } from '../Clock'
import { SequenceProcessor } from '../SequenceProcessor'

interface DailyCount {
  count: number
  timestamp: UnixTime
}

export class DailyCountView {
  private readonly refreshQueue: TaskQueue<void>

  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly dailyCountRepository: DailyCountRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.refreshQueue = new TaskQueue<void>(async () => {
      this.logger.info('Refresh started')
      await this.dailyCountRepository.refresh()
      this.logger.info('Refresh finished')
    }, this.logger.for('refreshQueue'))
  }

  start() {
    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.on('last reached', () => this.refreshQueue.addIfEmpty()),
    )
    this.clock.onEveryHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  async getDailyCounts(): Promise<Map<ProjectId, DailyCount[]>> {
    const allCounts = await this.dailyCountRepository.getDailyCounts()
    const projectCounts = allCounts.reduce<Map<ProjectId, DailyCount[]>>(
      (acc, { projectId, count, timestamp }) => {
        const counts = acc.get(projectId) ?? []
        counts.push({ count, timestamp })
        acc.set(projectId, counts)
        return acc
      },
      new Map(),
    )
    for (const [projectId, counts] of projectCounts) {
      const processor = this.processors.find(
        (p) => p.id === projectId.toString(),
      )
      if (!processor) {
        projectCounts.delete(projectId)
        continue
      }
      // TODO: fill missing days before tip
      const lastReached = await processor.isLastReached()
      const yesterday = UnixTime.now().toStartOf('day').add(-1, 'days')
      const lastIsYesterday = counts
        .at(-1)
        ?.timestamp.toStartOf('day')
        .equals(yesterday)

      if (!lastReached && lastIsYesterday) {
        counts.slice(-1)
      } else if (lastReached && !lastIsYesterday) {
        // TODO: fill missing days after tip
      }
    }
    return projectCounts
  }

  // TODO: monitor correctness
}
