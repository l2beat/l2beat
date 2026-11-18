import type { Database, GasFeesTipHourlyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { BlockFinder } from './types'

/** The first and last block of a UTC day. A block at midnight starts a day */
export async function getDayBlocks(
  finder: BlockFinder,
  day: UnixTime,
): Promise<{ firstBlock: number; lastBlock: number }> {
  const dayEnd = UnixTime(day + UnixTime.DAY)
  const [before, last, later] = await Promise.all([
    finder.getBlockNumberAtOrBefore(UnixTime(day - 1)),
    finder.getBlockNumberAtOrBefore(UnixTime(dayEnd - 1)),
    finder.getBlockNumberAtOrBefore(UnixTime(dayEnd + UnixTime.HOUR)),
  ])
  // Asked for a time past its newest block, the finder answers with that block:
  // a day cut short would then pass for a whole one
  if (later === last) {
    throw new Error('Block finder has no block past the day', {
      cause: { day, lastBlock: last },
    })
  }
  return { firstBlock: before + 1, lastBlock: last }
}

/**
 * Our hourly tips from the hour `from` to the hour `to`, both included. The
 * indexers that read them wait for the tip indexer, which starts a day before
 * their first day, so a missing hour is a bug, not a delay.
 */
export async function getHourlyTips(
  db: Database,
  from: UnixTime,
  to: UnixTime,
): Promise<GasFeesTipHourlyRecord[]> {
  const tips = await db.gasFeesTipHourly.getInRange(from, to)
  const hours = (to - from) / UnixTime.HOUR + 1
  if (tips.length !== hours) {
    throw new Error('Hourly tips missing', {
      cause: { from, to, hours: tips.length },
    })
  }
  return tips
}
