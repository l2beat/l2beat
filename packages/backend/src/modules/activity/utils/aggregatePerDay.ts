import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ActivityRecordWithoutRatio } from '../types'

type Block = {
  txsCount: number
  uopsCount: number | null
  timestamp: UnixTime
  number: number
}

export function aggregatePerDay(
  projectId: ProjectId,
  blocks: Block[],
): ActivityRecordWithoutRatio[] {
  const result = new Map<number, ActivityRecordWithoutRatio>()

  for (const block of blocks) {
    const timestamp = block.timestamp.toStartOf('day')
    const currentCount = result.get(timestamp.toNumber())

    if (currentCount) {
      currentCount.count += block.txsCount
      currentCount.start = Math.min(currentCount.start, block.number)
      currentCount.end = Math.max(currentCount.end, block.number)
      if (block.uopsCount) {
        currentCount.uopsCount = (currentCount.uopsCount ?? 0) + block.uopsCount
      }
    } else {
      result.set(timestamp.toNumber(), {
        projectId: projectId,
        timestamp,
        count: block.txsCount,
        uopsCount: block.uopsCount,
        start: block.number,
        end: block.number,
      })
    }
  }
  return [...result.values()]
}
