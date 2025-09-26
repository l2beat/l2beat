import type { UnixTime } from '@l2beat/shared-pure'

export async function getBlockNumberAtOrBefore(
  timestamp: UnixTime,
  start: number,
  end: number,
  getBlock: (number: number) => Promise<{ timestamp: number }>,
): Promise<number> {
  let result = start

  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const block = await getBlock(mid)

    if (block.timestamp <= timestamp) {
      result = mid
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return result
}
