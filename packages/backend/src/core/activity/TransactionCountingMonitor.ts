import { Logger } from '@l2beat/shared'
import { json, UnixTime } from '@l2beat/shared-pure'

import { Clock } from '../Clock'
import { TaskQueue } from '../queue/TaskQueue'
import { TransactionCounter } from './TransactionCounter'

interface TransactionCountingMonitorOpts {
  syncCheckDelayHours: number
}

interface SyncInfo extends Record<string, json> {
  projectId: string
  lastDayWithData: string | null
  hasProcessedAll: boolean
  isSynced: boolean
}

export class TransactionCountingMonitor {
  private readonly checkQueue: TaskQueue<void>
  private readonly delayHours: number

  constructor(
    private readonly counters: TransactionCounter[],
    private readonly clock: Clock,
    private readonly logger: Logger,
    opts?: TransactionCountingMonitorOpts,
  ) {
    this.logger = logger.for(this)
    this.delayHours = opts?.syncCheckDelayHours ?? 2
    this.checkQueue = new TaskQueue<void>(
      async () => {
        this.logger.info('Sync check triggered')
        await this.checkIfSynced()
      },
      this.logger.for('checkQueue'),
      { metricsId: TransactionCountingMonitor.name },
    )
  }

  start() {
    this.logger.info('Starting')
    this.clock.onNewHour(() => this.checkQueue.addIfEmpty())
    this.checkQueue.addIfEmpty()
    this.logger.info('Started')
  }

  async checkIfSynced(): Promise<void> {
    const lastHour = this.clock.getLastHour()
    if (!this.isTimeToCheck(lastHour)) {
      this.logger.info('Skipping sync check - too early')
      return
    }
    this.logger.info('Sync check started')
    const syncInfos = await this.getSyncInfos(lastHour)
    const today = lastHour.toYYYYMMDD()
    this.logger.info('Transaction counter sync check result', {
      today,
      syncInfos,
    })
    if (syncInfos.some((i) => !i.isSynced)) {
      this.logLagging(syncInfos, today)
    } else {
      this.logger.info('All transaction counters are synced', { today })
    }
    this.logger.info('Sync check finished')
  }

  private isTimeToCheck(lastHour: UnixTime): boolean {
    return lastHour.gte(lastHour.toStartOf('day').add(this.delayHours, 'hours'))
  }

  private async getSyncInfos(lastHour: UnixTime): Promise<SyncInfo[]> {
    return Promise.all(
      this.counters.map((counter) => this.getSyncInfo(counter, lastHour)),
    )
  }

  private async getSyncInfo(
    counter: TransactionCounter,
    lastHour: UnixTime,
  ): Promise<SyncInfo> {
    const lastTimestamp = await counter.getLastProcessedTimestamp()
    const lastDayWithData = lastTimestamp?.toYYYYMMDD() ?? null
    const hasProcessedAll = counter.hasProcessedAll()
    const isSynced = await counter.isSyncedUpToYesterdayInclusive(lastHour)
    return {
      projectId: counter.projectId.toString(),
      hasProcessedAll,
      lastDayWithData,
      isSynced,
    }
  }

  private logLagging(syncInfos: SyncInfo[], today: string): void {
    const unsyncedNames = syncInfos
      .filter((s) => !s.isSynced)
      .map((s) => s.projectId)
    const connector = unsyncedNames.length === 1 ? 'is' : 'are'

    this.logger.error(
      {
        message: `${unsyncedNames.join(', ')} ${connector} lagging behind`,
        syncInfo: {
          counters: syncInfos,
          today,
        },
      },
      new Error('Not all transaction counters are synced'),
    )
  }
}
