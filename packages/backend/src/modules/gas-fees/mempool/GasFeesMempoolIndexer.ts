import type { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesMempoolDayStatus } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { getDayBlocks, getHourlyTips } from '../dayInputs'
import { duneRetryStrategy, nextDays } from '../days'
import type { BlockFinder } from '../types'
import type { MempoolDayQueryInput } from './getMempoolDayQuery'
import type { MempoolDay } from './readMempoolDay'

/** Bump it when a fix changes what past days store: every day is read again, 0.1 to 0.35 Dune credits each */
const STORED_DATA_VERSION = '1'
/** Dune has a day within a day; until this long after it ends, a thin day is read again */
const SETTLE_SECONDS = 3 * UnixTime.DAY
/** The share of Flashbots' landed transactions Dune must have for a complete day */
const COMPLETE_SHARE = 0.99
/** Dune loads a day at once and every read is billed, so a thin day is read again this often at most */
const THIN_DAY_RECHECK_SECONDS = 6 * UnixTime.HOUR

interface GasFeesMempoolIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  firstDay: UnixTime
  db: Database
  blockFinder: BlockFinder
  readMempoolDay: (input: MempoolDayQueryInput) => Promise<MempoolDay>
  readFlashbotsLandedCount: (day: UnixTime) => Promise<number | undefined>
  now?: () => UnixTime
}

/**
 * Mempool waits per finished UTC day, against Flashbots' own count of the
 * day, as Dune's copy silently drops days. A height is a day boundary at or
 * after the end of the last stored day.
 */
export class GasFeesMempoolIndexer extends ManagedChildIndexer {
  private thinDay:
    | { day: UnixTime; counts: object; readAt: UnixTime }
    | undefined

  constructor(
    private readonly $: GasFeesMempoolIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_MEMPOOL,
        minHeight: $.firstDay + UnixTime.DAY,
        configHash: `${STORED_DATA_VERSION}:${$.firstDay}`,
        updateRetryStrategy: duneRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const day = nextDays(from, to)[0]
    if (day === undefined) return to

    const now = this.$.now?.() ?? UnixTime.now()
    if (
      this.thinDay?.day === day &&
      now < this.thinDay.readAt + THIN_DAY_RECHECK_SECONDS
    ) {
      throw new Error('Mempool day incomplete on Dune', {
        cause: this.thinDay.counts,
      })
    }

    const previousDay = UnixTime(day - UnixTime.DAY)
    // Some transactions landing on the day were first seen the day before
    const [hourlyTips, previous, blocks] = await Promise.all([
      getHourlyTips(this.$.db, previousDay, day),
      getDayBlocks(this.$.blockFinder, previousDay),
      getDayBlocks(this.$.blockFinder, day),
    ])
    const [mempool, flashbotsLandedCount] = await Promise.all([
      this.$.readMempoolDay({
        day,
        previousDayFirstBlock: previous.firstBlock,
        ...blocks,
        hourlyTips,
      }),
      this.$.readFlashbotsLandedCount(day),
    ])
    const status = getMempoolDayStatus(
      mempool.landedCount,
      flashbotsLandedCount,
      now >= day + UnixTime.DAY + SETTLE_SECONDS,
    )
    const counts = {
      day,
      duneLandedCount: mempool.landedCount,
      flashbotsLandedCount,
    }
    if (status === undefined) {
      this.thinDay = { day, counts, readAt: now }
      throw new Error('Mempool day incomplete on Dune', { cause: counts })
    }
    this.thinDay = undefined

    await this.$.db.gasFeesMempool.replaceDay({
      day: {
        timestamp: day,
        status,
        duneLandedCount: mempool.landedCount,
        flashbotsLandedCount: flashbotsLandedCount ?? null,
        keptCount: mempool.keptCount,
      },
      tipLevelWaits: status === 'missing' ? [] : mempool.tipLevelWaits,
      tierWaits: status === 'missing' ? [] : mempool.tierWaits,
    })
    if (status === 'complete') {
      this.logger.info('Saved mempool day', counts)
    } else {
      this.logger.warn('Saved incomplete mempool day', { ...counts, status })
    }
    return day + UnixTime.DAY
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.gasFeesMempool.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}

/**
 * undefined while Dune may still be loading a thin day. Once settled, a day
 * Dune never got is stored as missing, so the indexer moves on.
 */
export function getMempoolDayStatus(
  duneLandedCount: number,
  flashbotsLandedCount: number | undefined,
  settled: boolean,
): GasFeesMempoolDayStatus | undefined {
  if (
    flashbotsLandedCount !== undefined &&
    duneLandedCount > 0 &&
    duneLandedCount >= COMPLETE_SHARE * flashbotsLandedCount
  ) {
    return 'complete'
  }
  if (!settled) return undefined
  return duneLandedCount === 0 ? 'missing' : 'partial'
}
