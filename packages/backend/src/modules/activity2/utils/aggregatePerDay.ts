import { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'

type Block = {
  txsCount: number
  timestamp: UnixTime
  number: number
}

export function aggregatePerDay(
  projectId: ProjectId,
  blocks: Block[],
): ActivityRecord[] {
  const result = new Map<number, ActivityRecord>()

  for (const block of blocks) {
    const timestamp = block.timestamp.toStartOf('day')
    const currentCount = result.get(timestamp.toNumber())

    if (currentCount) {
      currentCount.count += block.txsCount
      currentCount.start = Math.min(currentCount.start, block.number)
      currentCount.end = Math.max(currentCount.end, block.number)
    } else {
      result.set(timestamp.toNumber(), {
        projectId: projectId,
        timestamp,
        count: block.txsCount,
        start: block.number,
        end: block.number,
      })
    }
  }
  return [...result.values()]
}
