import type { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesDailyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { DuneDayWait, nextDays, settlesAt } from '../days'
import type { GasFeesChain } from './chains'
import {
  type ChainDay,
  getDueFrom,
  getMissingChainDays,
  isAnyChainExpected,
  type LateRead,
  pickChainDays,
  planLateReads,
} from './lateDays'
import type { FeesDay } from './readFeesDays'

/** Bump it when a fix changes what past days store: every day is read again, 0.3 to 0.5 Dune credits each */
const STORED_DATA_VERSION = '1'
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
 * A day no chain has is waited for until it settles, then is late on every chain.
 * A height is a day boundary at or after the end of the last stored day.
 */
export class GasFeesDailyIndexer extends ManagedChildIndexer {
  private readonly waits: DuneDayWait
  private lateReadAt: UnixTime | undefined

  constructor(
    private readonly $: GasFeesDailyIndexerDeps,
    logger: Logger,
  ) {
    const waits = new DuneDayWait('Gas fees day not on Dune yet')
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_DAILY,
        minHeight: $.firstDay + UnixTime.DAY,
        // A new first day reads every day again
        configHash: `${STORED_DATA_VERSION}:${$.firstDay}`,
        updateRetryStrategy: waits.retryStrategy,
      },
      logger,
    )
    this.waits = waits
  }

  override async update(from: number, to: number): Promise<number> {
    const days = nextDays(this.$.firstDay, from, to, this.$.daysPerQuery)
    const first = days[0]
    const last = days.at(-1)
    if (first === undefined || last === undefined) return to
    const now = this.$.now?.() ?? UnixTime.now()

    const readDays = async (wait: (cause: { day: UnixTime }) => never) => {
      const read = await this.$.readFeesDays(this.$.chains, first, last)
      // A day no chain has all of is one Dune is still loading, unless none is
      // expected on it yet, or it has settled
      const unloaded = read.findIndex(
        (day) =>
          day.records.length === 0 &&
          isAnyChainExpected(this.$.chains, day.day) &&
          now < settlesAt(day.day),
      )
      const loaded = unloaded === -1 ? read : read.slice(0, unloaded)
      const records = loaded.flatMap((day) => day.records)
      await this.$.db.gasFeesDaily.upsertMany(records)
      await this.fillLateChains(first, now)

      const lastLoaded = loaded.at(-1)
      if (!lastLoaded) return wait({ day: first })
      const late = getMissingChainDays(
        this.$.chains,
        first,
        lastLoaded.day,
        records,
      )
      this.logger.info('Saved gas fees days', {
        from: first,
        days: loaded.length,
        late: late.map(describe),
      })
      // Too old to be read again
      this.warnLeftOut(late.filter(({ day }) => day < getDueFrom(now)))
      return lastLoaded.day + UnixTime.DAY
    }
    return await this.waits.run(first, now, readDays, settlesAt(first))
  }

  /**
   * Reads again the chain-days before `before` that are still due and not
   * stored. Fails soft: the days this update stored shouldn't be read again
   * because a late chain's read failed.
   */
  private async fillLateChains(before: UnixTime, now: UnixTime): Promise<void> {
    if (
      this.lateReadAt !== undefined &&
      now < this.lateReadAt + LATE_READ_MIN_GAP_SECONDS
    ) {
      return
    }
    try {
      const from = UnixTime(Math.max(this.$.firstDay, getDueFrom(now)))
      const to = UnixTime(before - UnixTime.DAY)
      // The day before the first one due has just stopped being read again
      const agedOut = UnixTime(from - UnixTime.DAY)
      if (from > to) return
      const stored = await this.$.db.gasFeesDaily.getInRange(agedOut, to)
      const { chains } = this.$
      if (agedOut >= this.$.firstDay) {
        this.warnLeftOut(getMissingChainDays(chains, agedOut, agedOut, stored))
      }

      const late = getMissingChainDays(chains, from, to, stored)
      const reads = planLateReads(late, this.$.daysPerQuery)
      if (reads.length === 0) return
      this.lateReadAt = now
      for (const read of reads) {
        stored.push(...(await this.readLate(read, late)))
      }
      this.logger.info('Filled late gas fees chain days', {
        late: late.length,
        stillLate: getMissingChainDays(chains, from, to, stored).length,
      })
    } catch (error) {
      this.logger.error('Late gas fees chains check failed', { error })
    }
  }

  /**
   * Stores what one late read fills. Each read fails on its own, so one Dune
   * keeps refusing doesn't stop the next, nor lose what the last one stored.
   */
  private async readLate(
    read: LateRead,
    late: ChainDay[],
  ): Promise<GasFeesDailyRecord[]> {
    try {
      const days = await this.$.readFeesDays(read.chains, read.from, read.to)
      // Only the late chain-days: the read also covers stored ones, which stay as they are
      const records = pickChainDays(
        days.flatMap((day) => day.records),
        late,
      )
      await this.$.db.gasFeesDaily.upsertMany(records)
      return records
    } catch (error) {
      this.logger.error('Late gas fees chains read failed', {
        error,
        from: read.from,
        to: read.to,
      })
      return []
    }
  }

  private warnLeftOut(chainDays: ChainDay[]): void {
    if (chainDays.length === 0) return
    this.logger.warn('Gas fees chain days left out, not whole on Dune', {
      leftOut: chainDays.map(describe),
    })
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.gasFeesDaily.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}

function describe({ chain, day }: ChainDay) {
  return { chain: chain.id, day }
}
