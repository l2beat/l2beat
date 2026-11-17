import type { Logger } from '@l2beat/backend-tools'
import type { Database, GasFeesTipGroup } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { getDayBlocks, getHourlyTips } from '../dayInputs'
import { duneRetryStrategy, nextDays, UnfinishedDay } from '../days'
import type { BlockFinder } from '../types'
import { gweiToWei } from '../units'
import type { TipPayersDayQueryInput } from './getTipPayersDayQuery'
import { isWholeTipPayersDay, type TipPayersDay } from './readTipPayersDay'

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
  private readonly unfinished = new UnfinishedDay(
    'Tip payers day incomplete on Dune',
  )

  constructor(
    private readonly $: GasFeesTipPayersIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.GAS_FEES_TIP_PAYERS,
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
    this.unfinished.throwIfRecent(day, now)

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
      fastTipWei: gweiToWei(fastTipGwei),
    })
    if (!isWholeTipPayersDay(tips, blocks)) {
      return this.unfinished.fail(day, now, {
        day,
        blocks: tips.blocks,
        incompleteBlocks: tips.incomplete_blocks,
        unknownCount: tips.unknown_count,
      })
    }
    this.unfinished.clear()
    const group = (txCount: number, tipEth: number): GasFeesTipGroup => ({
      txCount,
      tipEth,
      tipUsd: tipEth * ethUsd,
    })

    await this.$.db.gasFeesTipPayersDaily.upsert({
      timestamp: day,
      ethUsd,
      fastTipGwei,
      low: group(tips.low_count, tips.low_tip_eth),
      middle: group(tips.middle_count, tips.middle_tip_eth),
      high: group(tips.high_count, tips.high_tip_eth),
      roundTipTxCount: tips.round_tip_count,
      atFastTipEth: tips.at_fast_tip_eth,
      atFastTipUsd: tips.at_fast_tip_eth * ethUsd,
      nonOrdinary: group(tips.non_ordinary_count, tips.non_ordinary_tip_eth),
    })
    this.logger.info('Saved tip payers day', { day })
    return day + UnixTime.DAY
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
