import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { duneRetryStrategy, nextDays, UnfinishedDay } from '../days'
import type { GasFeesChain } from './chains'
import type { FeesDay } from './readFeesDays'

/** Bump it when a fix changes what past days store: every day is read again, 0.3 to 0.5 Dune credits each */
const STORED_DATA_VERSION = '1'
/**
 * A chain Dune is late with is read again for this long after the day. Counted
 * from now, not from the days being read, so a backfill can't run past a day
 * that is still due. After it, the day stays missing
 */
const LATE_DAYS = 30
/**
 * Every read is billed, so late chains are read at most this often. Once synced
 * the indexer runs daily; this bounds a backfill, where it runs many times an hour
 */
const LATE_READ_MIN_GAP_SECONDS = 6 * UnixTime.HOUR

interface GasFeesDailyIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  firstDay: UnixTime
  daysPerQuery: number
  chains: GasFeesChain[]
  db: Database
  readFeesDays: (
    chains: GasFeesChain[],
    fromDay: UnixTime,
    toDay: UnixTime,
  ) => Promise<FeesDay[]>
  now?: () => UnixTime
}

/**
 * Fees per chain and finished UTC day. Each chain's day is stored once Dune
 * has all of it, so a chain Dune loads late (Abstract, by a day) or stops
 * loading doesn't hold back the others; its days are filled in afterwards.
 * A height is a day boundary at or after the end of the last stored day.
 */
export class GasFeesDailyIndexer extends ManagedChildIndexer {
  private lateReadAt: UnixTime | undefined
  private readonly unloaded = new UnfinishedDay('Gas fees day not on Dune yet')

  constructor(
    private readonly $: GasFeesDailyIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_DAILY,
        minHeight: $.firstDay + UnixTime.DAY,
        // A new first day reads every day again
        configHash: `${STORED_DATA_VERSION}:${$.firstDay}`,
        updateRetryStrategy: duneRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const days = nextDays(this.$.firstDay, from, to, this.$.daysPerQuery)
    const first = days[0]
    if (first === undefined) return to
    const now = this.$.now?.() ?? UnixTime.now()
    this.unloaded.throwIfRecent(first, now)

    const read = await this.$.readFeesDays(
      this.$.chains,
      first,
      days.at(-1) ?? first,
    )
    // A day no chain has all of is one Dune is still loading
    const unloaded = read.findIndex((day) => day.records.length === 0)
    const loaded = unloaded === -1 ? read : read.slice(0, unloaded)
    const last = loaded.at(-1)
    if (!last) {
      return this.unloaded.fail(first, now, { day: first })
    }
    this.unloaded.clear()
    await this.$.db.gasFeesDaily.upsertMany(
      loaded.flatMap((day) => day.records),
    )
    this.logger.info('Saved gas fees days', {
      from: first,
      days: loaded.length,
      late: loaded.flatMap((day) =>
        day.missing.map((chain) => ({ day: day.day, chain })),
      ),
    })
    // Too old for the late-chain read, so these stay missing
    const dueFrom = UnixTime.toStartOf(now, 'day') - LATE_DAYS * UnixTime.DAY
    const leftOut = loaded
      .filter((day) => day.day < dueFrom)
      .flatMap((day) => day.missing.map((chain) => ({ day: day.day, chain })))
    if (leftOut.length > 0) {
      this.logger.warn('Gas fees chain days left out, not whole on Dune', {
        leftOut,
      })
    }
    await this.fillLateChains(first, now)
    return last.day + UnixTime.DAY
  }

  /** Fails soft: the days already stored shouldn't be read again because a late chain's read failed */
  private async fillLateChains(before: UnixTime, now: UnixTime): Promise<void> {
    try {
      if (
        this.lateReadAt !== undefined &&
        now < this.lateReadAt + LATE_READ_MIN_GAP_SECONDS
      ) {
        return
      }
      const from = UnixTime(
        Math.max(
          this.$.firstDay,
          UnixTime.toStartOf(now, 'day') - LATE_DAYS * UnixTime.DAY,
        ),
      )
      if (from >= before) return
      // A day more, to see what leaves the window still late
      const agedOut = UnixTime(from - UnixTime.DAY)
      const stored = await this.$.db.gasFeesDaily.getInRange(
        agedOut,
        UnixTime(before - UnixTime.DAY),
      )
      const have = new Set(stored.map((r) => `${r.chain}:${r.timestamp}`))
      const lost = this.$.chains
        .filter(
          (chain) =>
            agedOut >= this.$.firstDay &&
            agedOut >= chain.requiredFrom &&
            !have.has(`${chain.id}:${agedOut}`),
        )
        .map((chain) => chain.id)
      if (lost.length > 0) {
        this.logger.warn('Gas fees chain days left out, late for 30 days', {
          day: agedOut,
          chains: lost,
        })
      }
      const late: { day: UnixTime; chain: GasFeesChain }[] = []
      for (let day = from; day < before; day += UnixTime.DAY) {
        for (const chain of this.$.chains) {
          if (day >= chain.requiredFrom && !have.has(`${chain.id}:${day}`)) {
            late.push({ day, chain })
          }
        }
      }
      const oldest = late[0]?.day
      const newest = late.at(-1)?.day
      if (oldest === undefined || newest === undefined) return

      // Bounded reads: an old day Dune never loads mustn't widen every read. The newest late days
      // in one, and the oldest in another when they lie further back, as a chain that is late
      // every day keeps the newest on the last days and would starve an older day out of the window
      const span = (this.$.daysPerQuery - 1) * UnixTime.DAY
      const newestFrom = Math.max(oldest, newest - span)
      const batches = [late.filter(({ day }) => day >= newestFrom)]
      if (oldest < newestFrom) {
        batches.push(
          late.filter(({ day }) => day <= oldest + span && day < newestFrom),
        )
      }
      this.lateReadAt = now
      const filled = new Set<string>()
      for (const batch of batches) {
        const first = batch[0]?.day
        const last = batch.at(-1)?.day
        if (first === undefined || last === undefined) continue
        const read = await this.$.readFeesDays(
          [...new Set(batch.map(({ chain }) => chain))],
          first,
          last,
        )
        const records = read
          .flatMap((day) => day.records)
          .filter((r) => !have.has(`${r.chain}:${r.timestamp}`))
        // Stored before the next read, so that its failure doesn't lose these
        await this.$.db.gasFeesDaily.upsertMany(records)
        for (const r of records) filled.add(`${r.chain}:${r.timestamp}`)
      }
      this.logger.info('Filled late gas fees chain days', {
        from: oldest,
        filled: filled.size,
        stillLate: late.filter(
          ({ day, chain }) => !filled.has(`${chain.id}:${day}`),
        ).length,
      })
    } catch (error) {
      this.logger.error('Late gas fees chains read failed', { error })
    }
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.gasFeesDaily.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}
