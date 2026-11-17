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
/** "1× to 1.26× what it said", one histogram bar wide */
const TIER_BAND = '1.26'

/**
 * The day's kept mempool transactions as an additive histogram: per tip level
 * and wait bucket (grouping_set 0), per wait bucket for those tipping 1× to
 * 1.26× a tier of our estimator in the hour they were first seen
 * (grouping_set 2), and the day's totals (grouping_set 3).
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
  const tierColumns = GAS_FEES_TIERS.map(
    (tier) => `  count_if(is_kept and in_${tier}) as ${tier},
  count_if(is_kept and in_${tier} and blocks <= 1) as ${tier}_next_block,
  count_if(is_kept and in_${tier} and blocks <= 2) as ${tier}_within_2_blocks,
  count_if(is_kept and in_${tier} and blocks <= 5) as ${tier}_within_1_minute`,
  ).join(',\n')
  const inTier = (tier: string) =>
    `coalesce(c.tip_wei >= e.${tier}_wei and c.tip_wei < e.${tier}_wei * ${TIER_BAND}, false) as in_${tier}`

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
  grouping(tip_from_wei, bucket) as grouping_set,
  tip_from_wei,
  bucket,
  count(*) as landed,
  count_if(is_kept) as kept,
  count_if(is_kept and blocks <= 1) as next_block,
  coalesce(sum(if(is_kept, tip)), 0) as tip_sum_gwei,
${tierColumns}
from k
group by grouping sets ((tip_from_wei, bucket), (bucket), ())
having grouping(tip_from_wei, bucket) = 3
  or (count_if(is_kept) > 0 and (grouping(tip_from_wei, bucket) = 2 or tip_from_wei is not null))
order by 1, 2, 3
`
}
