import { assert, Logger, TaskQueue } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { groupBy } from 'lodash'

import { DailyTransactionCountViewRepository } from '../../peripherals/database/activity-v2/DailyTransactionCountViewRepository'
import { Clock } from '../Clock'
import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../SequenceProcessor'
import { postprocessCounts } from './postprocessCounts'
import { DailyTransactionCountProjectsMap } from './types'

interface DailyTransactionCountServiceOpts {
  syncCheckDelayHours: number
}

interface SyncInfo {
  lastDayWithData: string
  hasProcessedAll: boolean
  synced: boolean
}

export class DailyTransactionCountService {
  private readonly refreshQueue: TaskQueue<void>
  private readonly delayHours: number

  constructor(
    private readonly processors: SequenceProcessor[],
    private readonly viewRepository: DailyTransactionCountViewRepository,
    private readonly clock: Clock,
    private readonly logger: Logger,
    opts?: DailyTransactionCountServiceOpts,
  ) {
    this.logger = logger.for(this)
    this.delayHours = opts?.syncCheckDelayHours ?? 2
    this.refreshQueue = new TaskQueue<void>(async () => {
      this.logger.info('Refresh started')
      await this.viewRepository.refresh()
      this.logger.info('Refresh finished')
      await this.checkSyncCorrectness()
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
    const allCounts = await this.viewRepository.getDailyCounts()
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
    if (!this.isTimeToCheck(lastHour)) {
      this.logger.info('Skipping sync check - too early')
      return
    }
    const today = lastHour.toYYYYMMDD()
    this.logger.info('Sync check started', { today })
    const syncInfos = await this.getProcessorSyncInfos(today)
    if (syncInfos.some((i) => !i.synced)) {
      this.logLaggingError(syncInfos, today)
    } else {
      this.logger.info('Transaction counters are synced', { today })
    }
    this.logger.info('Sync check finished', { today })
  }

  private isTimeToCheck(lastHour: UnixTime): boolean {
    return lastHour.gte(lastHour.toStartOf('day').add(this.delayHours, 'hours'))
  }

  private async getProcessorSyncInfos(today: string): Promise<SyncInfo[]> {
    return Promise.all(
      this.processors.map(async (processor) => {
        const counts = await this.viewRepository.getDailyCountsByProject(
          ProjectId(processor.id),
        )
        const lastTimestamp = counts.at(-1)?.timestamp
        assert(lastTimestamp)
        const lastDayWithData = lastTimestamp.toYYYYMMDD()
        return {
          processorId: processor.id,
          hasProcessedAll: processor.hasProcessedAll(),
          lastDayWithData,
          synced: lastDayWithData === today || processor.hasProcessedAll(),
        }
      }),
    )
  }

  private logLaggingError(syncInfos: SyncInfo[], today: string) {
    this.logger.error(
      {
        syncInfo: {
          processors: syncInfos.map((i) => ({ ...i })),
          today,
        },
      },
      new Error('Transaction counters are not synced'),
    )
  }
}
