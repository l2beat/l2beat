import type { ActivityHeadBlockRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

export interface LiveBlock {
  number: number
  timestamp: UnixTime
  count: number
  uopsCount: number
  /** Since the block before it, over which its rate is averaged */
  seconds: number
}

/**
 * The blocks of the last `windowSeconds` up to the newest, each with the time
 * since the block before it. A missed slot doubles that time, so the rate
 * does not spike. The first block has no block before it and is left out
 */
export function toLiveBlocks(
  records: ActivityHeadBlockRecord[],
  windowSeconds: number,
): LiveBlock[] {
  const run = getUnbrokenRunToNewest(records)
  const newest = run.at(-1)
  if (!newest) return []

  const blocks: LiveBlock[] = []
  for (let i = 1; i < run.length; i++) {
    const block = run[i]
    const before = run[i - 1]
    if (!block || !before) continue
    if (block.timestamp <= newest.timestamp - windowSeconds) continue
    blocks.push({
      number: block.number,
      timestamp: block.timestamp,
      count: block.count,
      uopsCount: block.uopsCount ?? block.count,
      seconds: block.timestamp - before.timestamp,
    })
  }
  return blocks
}

function getUnbrokenRunToNewest(records: ActivityHeadBlockRecord[]) {
  const sorted = [...records].sort((a, b) => a.number - b.number)
  let start = sorted.length - 1
  while (
    start > 0 &&
    sorted[start - 1]?.number === (sorted[start]?.number ?? 0) - 1
  ) {
    start--
  }
  return sorted.slice(Math.max(start, 0))
}
