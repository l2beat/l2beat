import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { duneRetryStrategy, nextDays } from '../days'
import type { GasFeesChain } from './chains'
import type { FeesDay } from './readFeesDays'

/** Bump it when a fix changes what past days store: every day is read again, 0.16 to 0.3 Dune credits each */
const STORED_DATA_VERSION = '1'
/** A chain Dune is late with is read again for this long. After it, its days stay missing */
const LATE_DAYS = 30
/** Every read is billed, so late chains are read again this often at most */
const LATE_RECHECK_SECONDS = 6 * UnixTime.HOUR

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
    const days = nextDays(from, to, this.$.daysPerQuery)
    const first = days[0]
    if (first === undefined) return to

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
      throw new Error('Gas fees day not on Dune yet', { cause: { day: first } })
    }
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
    await this.fillLateChains(first)
    return last.day + UnixTime.DAY
  }

  /** Fails soft: the days already stored shouldn't be read again because a late chain's read failed */
  private async fillLateChains(before: UnixTime): Promise<void> {
    try {
      const now = this.$.now?.() ?? UnixTime.now()
      if (
        this.lateReadAt !== undefined &&
        now < this.lateReadAt + LATE_RECHECK_SECONDS
      ) {
        return
      }
      const from = UnixTime(
        Math.max(this.$.firstDay, before - LATE_DAYS * UnixTime.DAY),
      )
      if (from >= before) return
      const stored = await this.$.db.gasFeesDaily.getInRange(
        from,
        UnixTime(before - UnixTime.DAY),
      )
      const have = new Set(stored.map((r) => `${r.chain}:${r.timestamp}`))
      const lateDays: UnixTime[] = []
      const lateChains = new Set<GasFeesChain>()
      for (let day = from; day < before; day += UnixTime.DAY) {
        for (const chain of this.$.chains) {
          if (day >= chain.requiredFrom && !have.has(`${chain.id}:${day}`)) {
            lateDays.push(day)
            lateChains.add(chain)
          }
        }
      }
      const firstLate = lateDays[0]
      if (firstLate === undefined) return

      this.lateReadAt = now
      const read = await this.$.readFeesDays(
        [...lateChains],
        firstLate,
        lateDays.at(-1) ?? firstLate,
      )
      const records = read
        .flatMap((day) => day.records)
        .filter((r) => !have.has(`${r.chain}:${r.timestamp}`))
      await this.$.db.gasFeesDaily.upsertMany(records)
      this.logger.info('Filled late gas fees chain days', {
        from: firstLate,
        filled: records.length,
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
