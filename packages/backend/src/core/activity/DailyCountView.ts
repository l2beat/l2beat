import { Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'

import {
  DailyCountRecord,
  DailyCountRepository,
} from '../../peripherals/database/transactions/DailyCountRepository'
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
      // TODO: check sync correctness
      this.logger.info('Refresh finished')
    }, this.logger.for('refreshQueue'))
  }

  start() {
    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.on('last reached', () => {
        this.logger.info(
          `Received 'last reached' event for ${processor.id} - scheduling refresh`,
        )
        this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onEveryHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  async getDailyCounts(): Promise<Map<ProjectId, DailyCount[]>> {
    const allCounts = await this.dailyCountRepository.getDailyCounts()
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
      const lastReached = await processor.isLastReached()
      const yesterday = UnixTime.now().toStartOf('day').add(-1, 'days')
      const decidedCounts = decideAboutYesterday(counts, yesterday, lastReached)
      const filledCounts = fillMissingCounts(decidedCounts)
      projectCounts.set(projectId, filledCounts)
    }

    return projectCounts
  }
}

function decideAboutYesterday(
  counts: DailyCount[],
  yesterday: UnixTime,
  lastReached: boolean,
): DailyCount[] {
  if (!lastReached) {
    return counts.slice(-1)
  }

  const lastIsYesterday = counts
    .at(-1)
    ?.timestamp.toStartOf('day')
    .equals(yesterday)

  return lastIsYesterday
    ? counts
    : counts.concat([{ timestamp: yesterday, count: 0 }])
}

function groupByProjectId(
  allCounts: DailyCountRecord[],
): Map<ProjectId, DailyCount[]> {
  return allCounts.reduce<Map<ProjectId, DailyCount[]>>(
    (acc, { projectId, count, timestamp }) => {
      const counts = acc.get(projectId) ?? []
      counts.push({ count, timestamp })
      acc.set(projectId, counts)
      return acc
    },
    new Map(),
  )
}

function fillMissingCounts(counts: DailyCount[]): DailyCount[] {
  if (counts.length === 0) return []

  const result = []
  const lastTimestamp = counts[counts.length - 1].timestamp
  let timestamp = counts[0].timestamp
  let i = 0

  while (timestamp.lte(lastTimestamp)) {
    const existing = counts.at(i)
    if (existing?.timestamp.equals(timestamp)) {
      result.push(existing)
      i++
    } else {
      result.push({ timestamp, count: 0 })
    }
    timestamp = timestamp.add(1, 'days')
  }

  return result
}
