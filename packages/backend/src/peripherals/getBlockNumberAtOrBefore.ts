import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

export async function getBlockNumberAtOrBefore(
  timestamp: UnixTime,
  start: number,
  end: number,
  getBlock: (number: number) => Promise<{ timestamp: number }>,
  logger?: Logger,
): Promise<number> {
  while (start + 1 < end) {
    const mid = start + Math.floor((end - start) / 2)
    if (logger) logger.info('Fetching block', { start, end, mid })
    const midBlock = await getBlock(Number(mid))
    if (logger) logger.info('Fetched block', { block: mid })
    const midTimestamp = new UnixTime(midBlock.timestamp)
    if (midTimestamp.lte(timestamp)) {
      start = mid
    } else {
      end = mid
    }
  }

  return start
}
