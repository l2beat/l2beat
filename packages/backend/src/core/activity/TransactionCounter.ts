import { ProjectId, UnixTime } from '@l2beat/types'

import { ALL_PROCESSED_EVENT, SequenceProcessor } from '../SequenceProcessor'

export class TransactionCounter {
  constructor(
    readonly projectId: ProjectId,
    private readonly processor: SequenceProcessor,
    readonly getLastProcessedTimestamp: () => Promise<UnixTime | undefined>,
  ) {}

  start(): void {
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
    const lastDayWithData = lastTimestamp.toYYYYMMDD()
    const today = now.toYYYYMMDD()
    return lastDayWithData === today || this.hasProcessedAll()
  }
}
