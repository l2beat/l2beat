import { json, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  ALL_PROCESSED_EVENT,
  SequenceProcessor,
  SequenceProcessorStatus,
} from '../SequenceProcessor'

type TransactionCounterStatus = Record<
  | 'lastProcessedTimestamp'
  | 'hasProcessedAll'
  | 'isSyncedUpToYesterdayInclusive',
  json
> &
  SequenceProcessorStatus

export class TransactionCounter {
  constructor(
    readonly projectId: ProjectId,
    private readonly processor: SequenceProcessor,
    readonly getLastProcessedTimestamp: () => Promise<UnixTime | undefined>,
  ) {}

  start(): Promise<void> {
    return this.processor.start()
  }

  hasProcessedAll(): boolean {
    return this.processor.hasProcessedAll()
  }

  onProcessedAll(listener: () => void): void {
    this.processor.on(ALL_PROCESSED_EVENT, listener)
  }

  async isSyncedUpToYesterdayInclusive(now: UnixTime): Promise<boolean> {
    const lastTimestamp = await this.getLastProcessedTimestamp()
    if (!lastTimestamp) return false
    return this.processedAllOrToday(now, lastTimestamp)
  }

  async getStatus(now: UnixTime): Promise<TransactionCounterStatus> {
    const lastProcessedTimestamp = await this.getLastProcessedTimestamp()
    return {
      lastProcessedTimestamp:
        lastProcessedTimestamp?.toDate().toISOString() ?? null,
      hasProcessedAll: this.hasProcessedAll(),
      isSyncedUpToYesterdayInclusive: this.processedAllOrToday(
        now,
        lastProcessedTimestamp,
      ),
      ...this.processor.getStatus(),
    }
  }

  private processedAllOrToday(
    now: UnixTime,
    lastProcessedTimestamp: UnixTime | undefined,
  ): boolean {
    if (!lastProcessedTimestamp) return false
    const lastDayWithData = lastProcessedTimestamp.toYYYYMMDD()
    const today = now.toYYYYMMDD()
    return lastDayWithData === today || this.hasProcessedAll()
  }
}
