import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { getDayBlocks, getHourlyTips } from '../dayInputs'
import { DuneDayWait, isSettled, nextDays } from '../days'
import type { BlockFinder } from '../types'
import type { TipPayersDayQueryInput } from './getTipPayersDayQuery'
import type { TipPayersDay } from './readTipPayersDay'

/** Bump it when a fix changes what past days store: every day is read again from Dune */
const STORED_DATA_VERSION = '1'

interface GasFeesTipPayersIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  firstDay: UnixTime
  db: Database
  blockFinder: BlockFinder
  readTipPayersDay: (input: TipPayersDayQueryInput) => Promise<TipPayersDay>
  now?: () => UnixTime
}

/**
 * Who pays the tips on Ethereum, per finished UTC day. A height is a day
 * boundary at or after the end of the last stored day.
 */
export class GasFeesTipPayersIndexer extends ManagedChildIndexer {
  private readonly waits: DuneDayWait

  constructor(
    private readonly $: GasFeesTipPayersIndexerDeps,
    logger: Logger,
  ) {
    const waits = new DuneDayWait('Tip payers day incomplete on Dune')
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_TIP_PAYERS,
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

    return await this.waits.run(day, now, async (wait) => {
      const [hourlyTips, blocks] = await Promise.all([
        getHourlyTips(this.$.db, day, day),
        getDayBlocks(this.$.blockFinder, day),
      ])
      // The day's price is the mean of our hourly Chainlink reads, as the methodology's is a mean of reads
      const ethUsd = mean(hourlyTips.map((hour) => hour.ethUsd))
      const fastTipGwei = mean(hourlyTips.map((hour) => hour.fastTipGwei))
      const tips = await this.$.readTipPayersDay({
        day,
        ...blocks,
        fastTipGwei,
      })
      if (!tips.whole && !isSettled(day, now)) {
        return wait({ day, ...tips.check })
      }

      if (tips.whole) {
        await this.$.db.gasFeesTipPayersDaily.upsert({
          timestamp: day,
          status: 'complete',
          ethUsd,
          fastTipGwei,
          ...tips.figures,
        })
        this.logger.info('Saved tip payers day', { day })
      } else {
        // Never as partial totals
        await this.$.db.gasFeesTipPayersDaily.upsert({
          timestamp: day,
          status: 'missing',
        })
        this.logger.warn('Saved missing tip payers day', {
          day,
          ...tips.check,
        })
      }
      return day + UnixTime.DAY
    })
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.gasFeesTipPayersDaily.deleteAfter(
      UnixTime(targetHeight - UnixTime.DAY),
    )
    return targetHeight
  }
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
