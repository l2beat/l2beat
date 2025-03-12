import type { UnixTime } from '@l2beat/shared-pure'

export async function getBlockNumberAtOrBefore(
  timestamp: UnixTime,
  start: number,
  end: number,
  getBlock: (number: number) => Promise<{ timestamp: number }>,
): Promise<number> {
  while (start + 1 < end) {
    const mid = start + Math.floor((end - start) / 2)
    const midBlock = await getBlock(mid)
    if (midBlock.timestamp <= timestamp) {
      start = mid
    } else {
      end = mid
    }
  }

  return start
}
