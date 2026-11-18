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
  total_fee: v.number(),
  total_fee_usd: v.union([v.number(), v.null()]),
  l1_fee: v.number(),
  blob_fee: v.number(),
  median_fee_usd: v.union([v.number(), v.null()]),
  /** Blocks the day's fee rows come from */
  fee_blocks: v.number(),
})
export type FeesRow = v.infer<typeof FeesRow>

const BlocksRow = v.object({
  blockchain: v.string(),
  day: v.string(),
  /** The three below are null on a neighbour day of a chain read from transactions, which is read only for its block range */
  base_fee: v.union([v.number(), v.null()]),
  gas_used: v.union([v.number(), v.null()]),
  /** Blocks of the day that had transactions */
  blocks_with_txs: v.union([v.number(), v.null()]),
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
      const fee = feesByKey.get(key(chain))
      const block = blocksByKey.get(key(chain))
      const record = fee && block && toWholeDay(chain, fee, block)
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
      days.set(`${row.blockchain}:${row.day}`, {
        row,
        earlier: rows[i - 1],
        later: rows[i + 1],
      })
    })
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
 * - the day's first block follows the last of the earlier day read, if any.
 *   Unchecked, a hole across midnight would be stored on the day after it;
 * - the fee rows come from every block that had transactions, so the fee table
 *   has loaded all the blocks table has.
 *
 * A hole at a day's edge keeps both days out: which of them lost the blocks can't be told.
 * On the year checked, the block checks held on every day of all 12 chains.
 */
function toWholeDay(
  chain: GasFeesChain,
  fee: FeesRow,
  { row, earlier, later }: BlocksDay,
): Omit<GasFeesDailyRecord, 'timestamp'> | undefined {
  if (row.gas_used === null || row.blocks_with_txs === null || !later) {
    return undefined
  }
  const whole =
    fee.fee_blocks === row.blocks_with_txs &&
    // On the days checked every block of a chain read from transactions had one
    (!chain.gasFromTransactions || row.blocks_with_txs === row.blocks) &&
    row.last_block - row.first_block + 1 === row.blocks &&
    later.first_block === row.last_block + 1 &&
    (!earlier || earlier.last_block + 1 === row.first_block)
  if (!whole) return undefined
  return {
    chain: chain.id,
    txCount: fee.tx_count,
    totalFeeNative: fee.total_fee,
    totalFeeUsd: fee.total_fee_usd,
    l1FeeNative: fee.l1_fee,
    blobFeeNative: fee.blob_fee,
    baseFeeNative: row.base_fee,
    gasUsed: row.gas_used,
    medianFeeUsd: fee.median_fee_usd,
  }
}
