import type { Env } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { FEE_RULES_CHECKED_FROM } from '../../modules/gas-fees/fees/feeRules'
import type { GasFeesConfig } from '../../modules/gas-fees/types'

const FIRST_HISTORY_DAY = '2021-08-08'

export function getGasFeesConfig(env: Env): GasFeesConfig {
  const daysPerQuery = env.integer('GAS_FEES_FEES_DAYS_PER_QUERY', 10)
  // With none the indexer would move on without reading a day. A day costs
  // about 0.35 Dune credits and a query is capped at 10, so 20 days is the most
  if (
    !Number.isInteger(daysPerQuery) ||
    daysPerQuery < 1 ||
    daysPerQuery > 20
  ) {
    throw new Error('Invalid gas fees days per query', {
      cause: { daysPerQuery },
    })
  }
  const historyFirstDay = toDay(
    env.string('GAS_FEES_HISTORY_FIRST_DAY', '2025-11-01'),
  )
  // A tip is what a transaction pays above the base fee, which London brought in
  // on 5 Aug 2021. Our tips start a day before the first day, from 1,800 blocks back
  if (historyFirstDay < toDay(FIRST_HISTORY_DAY)) {
    throw new Error('Gas fees history starts before London', {
      cause: { historyFirstDay },
    })
  }
  const feesFirstDay = toDay(
    env.string('GAS_FEES_FEES_FIRST_DAY', FEE_RULES_CHECKED_FROM),
  )
  // The chains' fee rules change with their upgrades, and were checked from this day on
  if (feesFirstDay < toDay(FEE_RULES_CHECKED_FROM)) {
    throw new Error('Gas fees start before the fee rules were checked', {
      cause: { feesFirstDay },
    })
  }
  return {
    fees: {
      firstDay: feesFirstDay,
      // About 3.5 Dune credits a query, under the 10-credit cap
      daysPerQuery,
    },
    // A rolling year for the page, with a margin
    historyFirstDay,
    walletServices: env.boolean('GAS_FEES_WALLET_SERVICES', false),
  }
}

function toDay(date: string): UnixTime {
  const day = UnixTime.fromDate(new Date(`${date}T00:00:00Z`))
  if (Number.isNaN(day) || UnixTime.toYYYYMMDD(day) !== date) {
    throw new Error('Invalid gas fees day', { cause: { date } })
  }
  return day
}
