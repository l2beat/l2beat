import type { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesMempoolDayStatus } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { getDayBlocks, getHourlyTips } from '../dayInputs'
import { DuneDayWait, nextDays, settlesAt } from '../days'
import type { BlockFinder } from '../types'
import type { MempoolDayQueryInput } from './getMempoolDayQuery'
import type { MempoolDay } from './readMempoolDay'

/** Bump it when a fix changes what past days store: every day is read again, 0.1 to 0.35 Dune credits each */
const STORED_DATA_VERSION = '1'
/** The share of Flashbots' landed transactions Dune must have for a complete day */
const COMPLETE_SHARE = 0.99

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
 * day, as Dune's copy silently drops days. A height is a time at or after the
 * end of the last stored day: an hour within a day, when the hourly tips set it.
 */
export class GasFeesMempoolIndexer extends ManagedChildIndexer {
  private readonly waits: DuneDayWait

  constructor(
    private readonly $: GasFeesMempoolIndexerDeps,
    logger: Logger,
  ) {
    const waits = new DuneDayWait('Mempool day incomplete on Dune')
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_MEMPOOL,
        minHeight: $.firstDay + UnixTime.DAY,
        configHash: `${STORED_DATA_VERSION}:${$.firstDay}`,
        updateRetryStrategy: waits.retryStrategy,
      },
      logger,
    )
    this.waits = waits
  }

  override async update(from: number, to: number): Promise<number> {
    const day = nextDays(this.$.firstDay, from, to)[0]
    if (day === undefined) return to
    const now = this.$.now?.() ?? UnixTime.now()

    const settled = now >= settlesAt(day)
    return await this.waits.run(
      day,
      now,
      async (wait) => {
        // Read before Dune, which is billed: without Flashbots' count the day can't be shown complete
        const flashbotsLandedCount = await this.$.readFlashbotsLandedCount(day)
        if (flashbotsLandedCount === undefined && !settled) {
          return wait({ day, flashbotsLandedCount })
        }

        const mempool = await this.readDay(day)
        const status = getMempoolDayStatus(
          mempool.landedCount,
          flashbotsLandedCount,
        )
        const counts = {
          day,
          duneLandedCount: mempool.landedCount,
          flashbotsLandedCount,
        }
        if (status !== 'complete' && !settled) return wait(counts)

        // A missing day has no rows on Dune, so its waits are empty
        await this.$.db.gasFeesMempool.replaceDay({
          day: {
            timestamp: day,
            status,
            duneLandedCount: mempool.landedCount,
            flashbotsLandedCount: flashbotsLandedCount ?? null,
            keptCount: mempool.keptCount,
          },
          tipLevelWaits: mempool.tipLevelWaits,
          tierWaits: mempool.tierWaits,
        })
        if (status === 'complete') {
          this.logger.info('Saved mempool day', counts)
        } else {
          this.logger.warn('Saved incomplete mempool day', {
            ...counts,
            status,
          })
        }
        return day + UnixTime.DAY
      },
      settlesAt(day),
    )
  }

  private async readDay(day: UnixTime): Promise<MempoolDay> {
    const previousDay = UnixTime(day - UnixTime.DAY)
    const [hourlyTips, previous, blocks] = await Promise.all([
      // Some transactions landing on the day were first seen the day before,
      // and a few up to 4 seconds after their block, in the hour after the day
      getHourlyTips(this.$.db, previousDay, UnixTime(day + UnixTime.DAY)),
      getDayBlocks(this.$.blockFinder, previousDay),
      getDayBlocks(this.$.blockFinder, day),
    ])
    return await this.$.readMempoolDay({
      day,
      previousDayFirstBlock: previous.firstBlock,
      ...blocks,
      hourlyTips,
    })
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.gasFeesMempool.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}

/** What Dune has of the day, against Flashbots' count of it when there is one */
export function getMempoolDayStatus(
  duneLandedCount: number,
  flashbotsLandedCount: number | undefined,
): GasFeesMempoolDayStatus {
  if (duneLandedCount === 0) return 'missing'
  return flashbotsLandedCount !== undefined &&
    duneLandedCount >= COMPLETE_SHARE * flashbotsLandedCount
    ? 'complete'
    : 'partial'
}
