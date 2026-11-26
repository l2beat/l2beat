import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  EthereumStakingDailyRecord,
  EthereumSupplyDailyRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import type { BurnDay } from './dune/readDuneBurns'

const DAY = UnixTime.DAY
/** Days burned per Dune query. */
const MAX_DAYS = 60

/**
 * ETH in existence at the start of 1 January 2024, from ultrasound.money's
 * supply series (https://ultrasound.money/api/v2/fees/supply-over-time,
 * `since_merge`): the balances of every execution account and validator, less
 * the ETH sent to the deposit contract.
 */
export const SUPPLY_ANCHOR: EthereumSupplyDailyRecord = {
  timestamp: UnixTime.fromDate(new Date('2024-01-01T00:00:00Z')),
  supply: 120_181_893.908,
}

/** Bump it when a fix changes what past days store. */
const STORED_DATA_VERSION = '2'

interface EthereumSupplyIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name' | 'minHeight'> {
  /** The first day stored; the anchor's day. */
  firstDay: UnixTime
  db: Database
  readBurns: (
    fromDay: UnixTime,
    toDay: UnixTime,
  ) => Promise<Map<UnixTime, BurnDay>>
}

/**
 * ETH's supply as each UTC day starts: SUPPLY_ANCHOR, plus what validators
 * earned and less what blocks burned since. Since the Merge nothing else
 * creates or destroys ETH. A child of the staking indexer, as a day's
 * issuance is read from its rows: a height is the end of the last stored day.
 */
export class EthereumSupplyIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: EthereumSupplyIndexerDeps,
    logger: Logger,
  ) {
    if ($.firstDay !== SUPPLY_ANCHOR.timestamp) {
      throw new Error('ETH supply must start on its anchor day', {
        cause: { firstDay: $.firstDay, anchor: SUPPLY_ANCHOR.timestamp },
      })
    }
    super(
      {
        ...$,
        name: INDEXER_NAMES.ETHEREUM_SUPPLY,
        minHeight: $.firstDay + DAY,
        configHash: STORED_DATA_VERSION,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async update(from: number, to: number): Promise<number> {
    const first = UnixTime(UnixTime.toEndOf(UnixTime(from), 'day') - DAY)
    const last = UnixTime(Math.min(to - DAY, first + (MAX_DAYS - 1) * DAY))

    const records =
      first === SUPPLY_ANCHOR.timestamp
        ? [SUPPLY_ANCHOR, ...(await this.readDays(SUPPLY_ANCHOR, last))]
        : await this.readDays(await this.getStored(first - DAY), last)

    await this.$.db.ethereumSupplyDaily.upsertMany(records)
    this.logger.info('Saved ETH supply', { first, last })
    return last + DAY
  }

  /** The days after `previous`, up to `last`. */
  private async readDays(
    previous: EthereumSupplyDailyRecord,
    last: UnixTime,
  ): Promise<EthereumSupplyDailyRecord[]> {
    if (last <= previous.timestamp) return []
    const lastBurned = UnixTime(last - DAY)
    const [stakingDays, burns] = await Promise.all([
      this.$.db.ethereumStakingDaily.getInRange(previous.timestamp, last),
      this.$.readBurns(previous.timestamp, lastBurned),
    ])
    const staking = new Map(stakingDays.map((day) => [day.timestamp, day]))

    const records: EthereumSupplyDailyRecord[] = []
    let change = 0n
    for (let day = previous.timestamp; day <= lastBurned; day += DAY) {
      const start = staking.get(day)
      const end = staking.get(UnixTime(day + DAY))
      const burn = burns.get(day)
      if (!start || !end || !burn || burn.blockCount !== start.blockCount) {
        throw new Error('ETH supply inputs missing', {
          cause: { day, start, end, burn },
        })
      }
      change += getIssuance(start, end) - burn.burn
      records.push({
        timestamp: UnixTime(day + DAY),
        supply: previous.supply + Number(change) / 1e18,
      })
    }
    return records
  }

  private async getStored(day: UnixTime): Promise<EthereumSupplyDailyRecord> {
    const [record] = await this.$.db.ethereumSupplyDaily.getInRange(day, day)
    if (!record) {
      throw new Error('ETH supply of the previous day missing', {
        cause: { day },
      })
    }
    return record
  }

  override async invalidate(targetHeight: number): Promise<number> {
    await this.$.db.ethereumSupplyDaily.deleteAfter(
      UnixTime(targetHeight - DAY),
    )
    return targetHeight
  }
}

/**
 * What validators earned over the day `start` begins, net of penalties, wei:
 * the change in what they hold, plus what they withdrew, less the deposits
 * credited to them.
 */
export function getIssuance(
  start: EthereumStakingDailyRecord,
  end: EthereumStakingDailyRecord,
): bigint {
  const held = (day: EthereumStakingDailyRecord) =>
    day.totalBalance + (day.pendingDeposits ?? 0n)
  return held(end) - held(start) + start.withdrawals - start.deposits
}
