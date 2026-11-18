import type { GasFeesDailyRecord } from '@l2beat/database'
import type { DuneQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { GasFeesChain } from './chains'
import { getBlocksQuery, getFeesQuery } from './getFeesQueries'

export type FeesDune = Pick<DuneQueryService, 'query'>

const FeesRow = v.object({
  blockchain: v.string(),
  day: v.string(),
  tx_count: v.number(),
  /** Null when Dune has no price to convert a chain's fees with */
  total_fee: v.union([v.number(), v.null()]),
  total_fee_usd: v.union([v.number(), v.null()]),
  l1_fee: v.number(),
  blob_fee: v.number(),
  median_fee_usd: v.union([v.number(), v.null()]),
  /** Gas used by the day's fee rows */
  gas_used: v.number(),
})
export type FeesRow = v.infer<typeof FeesRow>

/** A chain's day without fee rows: no transaction paid a fee on it */
const NO_FEES: Omit<FeesRow, 'blockchain' | 'day'> = {
  tx_count: 0,
  total_fee: 0,
  total_fee_usd: 0,
  l1_fee: 0,
  blob_fee: 0,
  median_fee_usd: null,
  gas_used: 0,
}

const BlocksRow = v.object({
  blockchain: v.string(),
  day: v.string(),
  /** The two below are null on a neighbour day of a chain read from transactions, which is read only for its block range */
  base_fee: v.union([v.number(), v.null()]),
  gas_used: v.union([v.number(), v.null()]),
  /** Gas of the transactions that paid nothing, part of gas_used */
  free_gas: v.number(),
  /** Blocks its transactions come from. Only of a chain read from transactions */
  tx_blocks: v.union([v.number(), v.null()]),
  /** From the chain's blocks table */
  blocks: v.number(),
  first_block: v.number(),
  last_block: v.number(),
})
export type BlocksRow = v.infer<typeof BlocksRow>

export interface FeesDay {
  day: UnixTime
  /** The chains Dune has the whole day of */
  records: GasFeesDailyRecord[]
}

/**
 * Reads the days from `fromDay` to `toDay`, both included, in two Dune queries.
 * A chain's day is stored only when Dune has it whole: see toWholeDay.
 */
export async function readFeesDays(
  dune: FeesDune,
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
): Promise<FeesDay[]> {
  const [fees, blocks] = await Promise.all([
    dune.query(
      getFeesQuery(chains, fromDay, toDay),
      'medium',
      v.array(FeesRow),
    ),
    dune.query(
      getBlocksQuery(chains, fromDay, toDay),
      'medium',
      v.array(BlocksRow),
    ),
  ])
  return joinFeesDays(chains, fromDay, toDay, fees, blocks)
}

/** Joins the two queries' rows per chain and day, oldest day first */
export function joinFeesDays(
  chains: GasFeesChain[],
  fromDay: UnixTime,
  toDay: UnixTime,
  fees: FeesRow[],
  blocks: BlocksRow[],
): FeesDay[] {
  const feesByKey = new Map(fees.map((r) => [`${r.blockchain}:${r.day}`, r]))
  const blocksByKey = withNeighbours(blocks)
  const days: FeesDay[] = []
  for (let day = fromDay; day <= toDay; day += UnixTime.DAY) {
    const key = (chain: GasFeesChain) =>
      `${chain.dune}:${UnixTime.toYYYYMMDD(day)}`
    const records = chains.flatMap((chain) => {
      const fee = feesByKey.get(key(chain)) ?? NO_FEES
      const block = blocksByKey.get(key(chain))
      const record = block && toWholeDay(chain, fee, block)
      return record ? [{ ...record, timestamp: day }] : []
    })
    days.push({ day, records })
  }
  return days
}

interface BlocksDay {
  row: BlocksRow
  /** The nearest days of the chain that have blocks, as a halted chain has days without */
  earlier: BlocksRow | undefined
  later: BlocksRow | undefined
}

function withNeighbours(blocks: BlocksRow[]): Map<string, BlocksDay> {
  const byChain = new Map<string, BlocksRow[]>()
  for (const row of blocks) {
    byChain.set(row.blockchain, [...(byChain.get(row.blockchain) ?? []), row])
  }
  const days = new Map<string, BlocksDay>()
  for (const rows of byChain.values()) {
    // YYYY-MM-DD sorts as dates do
    rows.sort((a, b) => a.day.localeCompare(b.day))
    rows.forEach((row, i) => {
      const later = rows[i + 1]
      days.set(`${row.blockchain}:${row.day}`, {
        row,
        earlier: rows[i - 1],
        later,
      })
      // The chain made no blocks on the days up to the next row, or Dune lacks
      // them. Each is checked as a day without blocks, which only a halt passes
      for (const day of daysBetween(row.day, later?.day)) {
        days.set(`${row.blockchain}:${day}`, {
          row: {
            blockchain: row.blockchain,
            day,
            base_fee: 0,
            gas_used: 0,
            free_gas: 0,
            tx_blocks: 0,
            blocks: 0,
            first_block: row.last_block + 1,
            last_block: row.last_block,
          },
          earlier: row,
          later,
        })
      }
    })
  }
  return days
}

/** The days after `from` and before `to`, both as YYYY-MM-DD */
function daysBetween(from: string, to: string | undefined): string[] {
  if (to === undefined) return []
  const start = (day: string) => UnixTime.fromDate(new Date(`${day}T00:00:00Z`))
  const days: string[] = []
  for (
    let day = start(from) + UnixTime.DAY;
    day < start(to);
    day += UnixTime.DAY
  ) {
    days.push(UnixTime.toYYYYMMDD(UnixTime(day)))
  }
  return days
}

/**
 * The chain's day, if Dune has it whole: finished loading, and without a hole.
 * Dune loads some chains a day late, and a day half loaded looks like a quiet
 * one. That takes all of:
 * - no block is missing within the day;
 * - a later day has blocks, and its first follows the day's last, so the blocks
 *   table has the day to its end;
 * - the day's first block follows the last of the earlier day read. Unchecked,
 *   a hole across midnight would be stored on the day after it. With no earlier
 *   day within the days read, the day has to start the chain;
 * - the fee rows used as much gas as the day's blocks did, so the fee table has
 *   every transaction. Counting blocks is not enough: Dune had Abstract's
 *   19 June 2026 with 7 of 245,226 transactions missing.
 *
 * A hole at a day's edge keeps both days out: which of them lost the blocks can't be told.
 * A day the chain made no blocks on passes as a day without transactions, and
 * is stored as one: left out, it would be read again for a month.
 * On the year checked, the block checks held on every day of all 12 chains, and
 * the gas of 249 of the 252 chain-days sampled matched.
 */
function toWholeDay(
  chain: GasFeesChain,
  fee: typeof NO_FEES,
  { row, earlier, later }: BlocksDay,
): Omit<GasFeesDailyRecord, 'timestamp'> | undefined {
  if (row.gas_used === null || fee.total_fee === null || !later) {
    return undefined
  }
  const whole =
    // Sums of whole numbers far below 2^53, so exact as doubles
    fee.gas_used === row.gas_used &&
    // Gas read from transactions can't show that table is whole. Its blocks can:
    // on the days checked every block of such a chain had a transaction
    (!chain.gasFromTransactions || row.tx_blocks === row.blocks) &&
    row.last_block - row.first_block + 1 === row.blocks &&
    later.first_block === row.last_block + 1 &&
    (earlier
      ? earlier.last_block + 1 === row.first_block
      : row.first_block <= 1)
  if (!whole) return undefined
  return {
    chain: chain.id,
    txCount: fee.tx_count,
    totalFeeNative: fee.total_fee,
    totalFeeUsd: fee.total_fee_usd,
    l1FeeNative: fee.l1_fee,
    blobFeeNative: fee.blob_fee,
    baseFeeNative: row.base_fee,
    // Of the transactions that paid, as the fees are
    gasUsed: row.gas_used - row.free_gas,
    medianFeeUsd: fee.median_fee_usd,
  }
}
