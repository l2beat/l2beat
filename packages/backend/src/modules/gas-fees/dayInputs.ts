import type { Database, GasFeesTipHourlyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { BlockFinder } from './types'

/** The first and last block of a UTC day. Day boundaries never fall on a slot */
export async function getDayBlocks(
  finder: BlockFinder,
  day: UnixTime,
): Promise<{ firstBlock: number; lastBlock: number }> {
  const [before, last] = await Promise.all([
    finder.getBlockNumberAtOrBefore(day),
    finder.getBlockNumberAtOrBefore(UnixTime(day + UnixTime.DAY)),
  ])
  return { firstBlock: before + 1, lastBlock: last }
}

/**
 * Our hourly tips from `from` to the end of `day`. The indexers that read them
 * wait for the tip indexer, so a missing hour of `day` is a bug, not a delay.
 */
export async function getHourlyTips(
  db: Database,
  from: UnixTime,
  day: UnixTime,
): Promise<GasFeesTipHourlyRecord[]> {
  const tips = await db.gasFeesTipHourly.getInRange(
    from,
    UnixTime(day + UnixTime.DAY - UnixTime.HOUR),
  )
  const ofDay = tips.filter((tip) => tip.timestamp >= day)
  if (ofDay.length !== 24) {
    throw new Error('Hourly tips missing', {
      cause: { day, hours: ofDay.length },
    })
  }
  return tips
}
