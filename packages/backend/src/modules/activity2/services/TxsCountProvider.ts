import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'

interface BaseTxsCountProviderDeps {
  logger: Logger
  projectId: ProjectId
}

export abstract class TxsCountProvider {
  constructor(private readonly $: BaseTxsCountProviderDeps) {
    this.$.logger = $.logger.for(this).tag($.projectId.toString())
  }

  abstract getTxsCount(from: number, to: number): Promise<ActivityRecord[]>

  aggregatePerDay(
    blocks: {
      count: number
      timestamp: UnixTime
      number: number
    }[],
  ): ActivityRecord[] {
    const result: ActivityRecord[] = []

    for (const block of blocks) {
      const timestamp = block.timestamp.toStartOf('day')
      const currentCount = result.find(
        (r) => r.timestamp.toNumber() === timestamp.toNumber(),
      )

      if (currentCount) {
        currentCount.count += block.count
        currentCount.start = Math.min(currentCount.start, block.number)
        currentCount.end = Math.max(currentCount.end, block.number)
      } else {
        result.push({
          projectId: this.$.projectId,
          timestamp,
          count: block.count,
          start: block.number,
          end: block.number,
        })
      }
    }
    return result
  }
}
