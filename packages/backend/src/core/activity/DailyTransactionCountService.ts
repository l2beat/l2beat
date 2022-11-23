import { Logger, TaskQueue } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { groupBy } from 'lodash'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { Clock } from '../Clock'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../SequenceProcessor'
import { getLaggingProjects, LaggingProject } from './getLaggingProjects'
import { postprocessCounts } from './postprocessCounts'
import { DailyTransactionCountProjectsMap } from './types'

interface DailyTransactionCountServiceOpts {
  syncCheckDelayHours: number
}

export class DailyTransactionCountService {
  private readonly refreshQueue: TaskQueue<void>
  private readonly delayHours: number

  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly dailyTransactionCountRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    opts?: DailyTransactionCountServiceOpts,
  ) {
    this.logger = logger.for(this)
    this.delayHours = opts?.syncCheckDelayHours ?? 2
    this.refreshQueue = new TaskQueue<void>(async () => {
      this.logger.info('Refresh started')
      await this.dailyTransactionCountRepository.refresh()
      await this.checkSyncCorrectness()
      this.logger.info('Refresh finished')
    }, this.logger.for('refreshQueue'))
  }

  start() {
    this.logger.info('Started')
    this.processors.forEach((processor) =>
      processor.on(ALL_PROCESSED_EVENT, () => {
        this.logger.info(
          `Received ${ALL_PROCESSED_EVENT} event for ${processor.id} - scheduling refresh`,
        )
        this.refreshQueue.addIfEmpty()
      }),
    )
    this.clock.onEveryHour(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  /**
   * Returns counts with timestamps lower than or equal to yesterday.
   */
  async getDailyCounts(): Promise<DailyTransactionCountProjectsMap> {
    const allCounts =
      await this.dailyTransactionCountRepository.getDailyCounts()
    const groupedCounts = groupBy(allCounts, (r) => r.projectId.toString())
    const result = new Map()

    for (const [projectId, counts] of Object.entries(groupedCounts)) {
      const processor = this.processors.find(
        (p) => p.id === projectId.toString(),
      )
      if (!processor) {
        this.logger.debug(
          `Skipping ${projectId.toString()} from daily counts - no processor found`,
        )
        continue
      }
      const processedAll = processor.hasProcessedAll()
      const postprocessed = postprocessCounts(counts, processedAll)
      result.set(projectId, postprocessed)
    }

    return result
  }

  async checkSyncCorrectness() {
    const lastHour = this.clock.getLastHour()
    const startOfDay = lastHour.toStartOf('day')
    const timeToCheck = lastHour.gte(startOfDay.add(this.delayHours, 'hours'))
    if (!timeToCheck) {
      this.logger.info('Skipping fully sync check - too early')
      return
    }
    const expectedTip = startOfDay.add(-1, 'days')
    this.logger.info('Fully sync check started', {
      day: expectedTip.toYYYYMMDD(),
    })
    const counts = await this.getDailyCounts()
    const lagging = getLaggingProjects(counts, expectedTip)
    if (lagging.length > 0) {
      this.logLaggingError(lagging, expectedTip)
    } else {
      this.logger.info('Transaction counters are fully synced', {
        day: expectedTip.toYYYYMMDD(),
      })
    }
    this.logger.info('Fully sync check finished', {
      day: expectedTip.toYYYYMMDD(),
    })
  }

  private logLaggingError(lagging: LaggingProject[], expectedTip: UnixTime) {
    this.logger.error(
      {
        ...lagging.reduce(
          (acc, p) => ({
            ...acc,
            [p.projectId.toString()]: p.tip?.toYYYYMMDD() ?? null,
          }),
          {},
        ),
        expectedTip: expectedTip.toYYYYMMDD(),
      },
      new Error('Transaction counters are not fully synced'),
    )
  }
}
