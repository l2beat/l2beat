import type { GasFeesTipHourlyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_TIERS } from '../tips/estimateTips'
import { gweiToWei } from '../units'
import { getWaitBucketCases, TIP_LEVELS } from './buckets'

export interface MempoolDayQueryInput {
  /** Start of the UTC day */
  day: UnixTime
  /** The first block of the day before, for senders' earlier nonces and the slot map */
  previousDayFirstBlock: number
  firstBlock: number
  lastBlock: number
  /** Our hourly tips for the hours a transaction landing on the day may have been first seen in */
  hourlyTips: Pick<
    GasFeesTipHourlyRecord,
    'timestamp' | 'slowTipGwei' | 'mediumTipGwei' | 'fastTipGwei'
  >[]
}

const BEACON_GENESIS = 1606824023
const BOT = '0xbdb3ba9ffe392549e1f8658dd2630c141fdf47b6'
/** The kinds of row the query returns, as grouping(tip_from_wei, bucket) numbers them */
export const ROW_KIND = {
  /** Per tip level and wait bucket */
  level: 0,
  /** Per wait bucket, with tier_counts */
  tier: 2,
  /** The day's totals, with landed */
  total: 3,
} as const

/**
 * What tier_counts holds for each tier of GAS_FEES_TIERS, in this order: its
 * transactions, then those that landed within so many blocks. The query
 * writes the array from this list and the reader finds a count in it by name.
 */
export const TIER_COUNTS = [
  { field: 'txCount', withinBlocks: undefined },
  { field: 'nextBlockCount', withinBlocks: 1 },
  { field: 'within2BlocksCount', withinBlocks: 2 },
  { field: 'within5BlocksCount', withinBlocks: 5 },
] as const
/** "1× to 1.26× what it said", one histogram bar wide */
const TIER_BAND = '1.26'

/**
 * The day's kept mempool transactions as an additive histogram, in the three
 * kinds of row of ROW_KIND: per tip level and wait bucket; per wait bucket,
 * for those tipping 1× to 1.26× a tier of our estimator in the hour they were
 * first seen; and the day's totals. Only tips within TIP_LEVELS have a level
 * row, so those rows hold fewer transactions than the totals' kept.
 *
 * Dune bills the result by its bytes. So the tier counts are one array, null
 * on the other rows, `landed` is only on the totals, and counts are 4 bytes:
 * a fifth of the size of a column for each, with the same numbers.
 *
 * The filters, their order, the slot-based next block and the block ranges are
 * those of the query that reproduced the research year to within half a second.
 * The mempool table is filtered on one literal range of
 * included_at_block_height, as two ranges joined with OR scanned all of it.
 */
export function getMempoolDayQuery(input: MempoolDayQueryInput): string {
  const {
    day,
    previousDayFirstBlock: lo,
    firstBlock: start,
    lastBlock: end,
  } = input
  const date = (t: number) => `date '${UnixTime.toYYYYMMDD(UnixTime(t))}'`
  const previous = date(day - UnixTime.DAY)
  const next = date(day + UnixTime.DAY)
  const levels = TIP_LEVELS.map(
    (level) => `      when tip_wei < ${level.toWei} then ${level.fromWei}`,
  ).join('\n')
  const lowest = TIP_LEVELS[0]?.fromWei ?? 0
  const waitBuckets = getWaitBucketCases('delay_ms')
    .map((line) => `      ${line}`)
    .join('\n')
  const estimates = input.hourlyTips
    .map(
      (hour) =>
        `(${hour.timestamp * 1000}, ${gweiToWei(hour.slowTipGwei)}, ${gweiToWei(hour.mediumTipGwei)}, ${gweiToWei(hour.fastTipGwei)})`,
    )
    .join(',\n    ')
  const tierCounts = GAS_FEES_TIERS.flatMap((tier) =>
    TIER_COUNTS.map(({ withinBlocks }) => {
      const within =
        withinBlocks === undefined ? '' : ` and blocks <= ${withinBlocks}`
      return `    cast(count_if(is_kept and in_${tier}${within}) as integer)`
    }),
  ).join(',\n')
  const kind = 'grouping(tip_from_wei, bucket)'
  const inTier = (tier: string) =>
    // At the estimate counts, so a tier that says a tip of 0 is graded on the transactions tipping 0
    `coalesce(c.tip_wei = e.${tier}_wei or (c.tip_wei > e.${tier}_wei and c.tip_wei < e.${tier}_wei * ${TIER_BAND}), false) as in_${tier}`

  return `
with b as (
  select number, base_fee_per_gas as base,
    (cast(to_unixtime(time) as bigint) - ${BEACON_GENESIS}) / 12 as slot,
    max(base_fee_per_gas) over (order by number rows between current row and 9 following) as peak10
  from ethereum.blocks
  where date between ${previous} and ${next}
    and number between ${lo} and ${end + 60}
),
bs as (select *, lag(slot) over (order by number) as prev_slot from b),
slot_next as (
  select s as slot, number as next_number, base as next_base, peak10
  from bs cross join unnest(sequence(prev_slot + 1, slot)) as t(s)
  where prev_slot is not null
),
m as (
  select hash, "from" as sender, "to" as receiver, nonce,
    gas_fee_cap as fee_cap, gas_tip_cap as tip_cap,
    cast(timestamp_ms as bigint) as seen_ms,
    cast(inclusion_delay_ms as bigint) as delay_ms,
    included_at_block_height as height
  from dune.flashbots.dataset_mempool_dumpster
  where included_at_block_height between ${start} and ${end}
),
p as (
  select "from" as sender_bin, nonce, block_number
  from ethereum.transactions
  where block_date between ${previous} and ${date(day)}
    and block_number between ${lo} and ${end}
),
j as (
  select m.*, sn.next_number, sn.next_base, sn.peak10,
    least(m.tip_cap, m.fee_cap - lb.base) / 1e9 as tip,
    least(m.tip_cap, m.fee_cap - lb.base) as tip_wei,
    p.block_number as prev_nonce_block
  from m
  join b lb on lb.number = m.height
  left join slot_next sn on sn.slot = (m.seen_ms - ${BEACON_GENESIS}000 + 11999) / 12000
  left join p on p.sender_bin = from_hex(substr(m.sender, 3)) and p.nonce = m.nonce - 1
),
c as (
  select seen_ms, tip, tip_wei,
    case
      -- None on the day checked. Without this it would count as kept, in the longest wait bucket
      when delay_ms is null then '0 no_delay'
      when delay_ms < -4000 then '1 seen_late'
      when next_number is null then '2 no_next_block'
      when receiver = '${BOT}' then '3 bot'
      when tip_cap >= fee_cap then '4 tip_equals_fee'
      when fee_cap < next_base then '5 fee_below_base'
      when fee_cap < next_base * 1.423828125 + tip_cap then '6 no_headroom'
      when fee_cap < peak10 + tip_cap then '7 peak_cut'
      when prev_nonce_block >= next_number then '8 waiting_on_sender'
      else '9 kept'
    end as reason,
    case
      when tip_wei < ${lowest} then null
${levels}
    end as tip_from_wei,
    case
${waitBuckets}
    end as bucket,
    height - next_number + 1 as blocks
  from j
),
e as (
  select * from (values
    ${estimates}
  ) as e(hour_ms, slow_wei, medium_wei, fast_wei)
),
k as (
  select c.tip, c.tip_from_wei, c.bucket, c.blocks,
    c.reason = '9 kept' as is_kept,
    ${GAS_FEES_TIERS.map(inTier).join(',\n    ')}
  from c
  left join e on e.hour_ms = c.seen_ms - c.seen_ms % 3600000
)
select
  cast(${kind} as tinyint) as kind,
  tip_from_wei,
  cast(bucket as smallint) as bucket,
  if(${kind} = ${ROW_KIND.total}, cast(count(*) as integer)) as landed,
  cast(count_if(is_kept) as integer) as kept,
  cast(count_if(is_kept and blocks <= 1) as integer) as next_block,
  coalesce(sum(if(is_kept, tip)), 0) as tip_sum_gwei,
  if(${kind} = ${ROW_KIND.tier}, array[
${tierCounts}
  ]) as tier_counts
from k
group by grouping sets ((tip_from_wei, bucket), (bucket), ())
having ${kind} = ${ROW_KIND.total}
  or (count_if(is_kept) > 0 and (${kind} = ${ROW_KIND.tier} or tip_from_wei is not null))
order by 1, 2, 3
`
}
