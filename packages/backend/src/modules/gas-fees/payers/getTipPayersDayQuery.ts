import { GAS_FEES_TIP_BANDS, UnixTime } from '@l2beat/shared-pure'
import { gweiToWei } from '../units'

export interface TipPayersDayQueryInput {
  /** Start of the UTC day */
  day: UnixTime
  firstBlock: number
  lastBlock: number
  /** The day's mean fast tip, the cap for tips at the fast tip */
  fastTipGwei: number
}

const FORWARDER = '0xfeeeeee44046c3f61a8cc081e0918ef0de0a7ffc'
const LOW_BELOW_WEI = gweiToWei(GAS_FEES_TIP_BANDS.low[1])
const MIDDLE_BELOW_WEI = gweiToWei(GAS_FEES_TIP_BANDS.middle[1])
const ORDINARY_BELOW_WEI = gweiToWei(GAS_FEES_TIP_BANDS.high[1])
/** 1.000 and 2.000 gwei to three decimals */
const ROUND_TIPS_WEI = [
  [999_500_000, 1_000_500_000],
  [1_999_500_000, 2_000_500_000],
]

/**
 * Tips paid in every transaction of every block of the day, private ones
 * included, split for the page's "who pays the tips", with a check that
 * Dune has every block and all of each block's transactions.
 */
export function getTipPayersDayQuery(input: TipPayersDayQueryInput): string {
  const date = `date '${UnixTime.toYYYYMMDD(input.day)}'`
  const blocks = `between ${input.firstBlock} and ${input.lastBlock}`
  const ordinary = (condition: string, name: string) => `
  count_if(ordinary and ${condition}) as ${name}_count,
  coalesce(sum(if(ordinary and ${condition}, tip_eth)), 0) as ${name}_tip_eth,`
  const round = ROUND_TIPS_WEI.map(
    ([from, to]) => `(tip_wei >= ${from} and tip_wei < ${to})`,
  ).join(' or ')
  return `
with b as (
  select number, miner, base_fee_per_gas, gas_used
  from ethereum.blocks
  where date = ${date} and number ${blocks}
),
t as (
  select block_number, "from", "to", gas_used, gas_price
  from ethereum.transactions
  where block_date = ${date} and block_number ${blocks}
),
per_block as (
  select block_number, sum(gas_used) as gas_used
  from t
  group by 1
),
checked as (
  select count(*) as blocks,
    count_if(coalesce(p.gas_used, 0) <> b.gas_used) as incomplete_blocks
  from b
  left join per_block p on p.block_number = b.number
),
x as (
  select tip_wei,
    cast(tip_wei as double) * gas_used / 1e18 as tip_eth,
    cast(least(tip_wei, ${gweiToWei(input.fastTipGwei)}) as double) * gas_used / 1e18 as at_fast_tip_eth,
    -- A builder paying itself in its own block is recognised by sender: the block's fee recipient
    tip_wei < ${ORDINARY_BELOW_WEI}
      and "from" <> miner
      and coalesce("to" <> ${FORWARDER}, true) as ordinary
  from (
    select t.gas_price - b.base_fee_per_gas as tip_wei, cast(t.gas_used as double) as gas_used,
      t."from", t."to", b.miner
    from t
    join b on b.number = t.block_number
  ) as s
),
tips as (
  select${ordinary(`tip_wei < ${LOW_BELOW_WEI}`, 'low')}${ordinary(`tip_wei >= ${LOW_BELOW_WEI} and tip_wei < ${MIDDLE_BELOW_WEI}`, 'middle')}${ordinary(`tip_wei >= ${MIDDLE_BELOW_WEI}`, 'high')}
  count_if(ordinary and (${round})) as round_tip_count,
  coalesce(sum(if(ordinary, at_fast_tip_eth)), 0) as at_fast_tip_eth,
  count_if(not ordinary) as non_ordinary_count,
  coalesce(sum(if(not ordinary, tip_eth)), 0) as non_ordinary_tip_eth,
  count_if(ordinary is null) as unknown_count
  from x
)
select * from checked cross join tips
`
}
