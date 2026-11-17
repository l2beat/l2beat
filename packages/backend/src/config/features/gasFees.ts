import type { Env } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import type { GasFeesConfig } from '../../modules/gas-fees/types'

export function getGasFeesConfig(env: Env): GasFeesConfig {
  return {
    fees: {
      // A day costs 0.3 to 0.5 Dune credits, so the history back to 2020 (750 to 1,250) is opted into
      firstDay: toDay(env.string('GAS_FEES_FEES_FIRST_DAY', '2025-11-01')),
      // At most about 5 Dune credits a query, under the 10-credit cap
      daysPerQuery: env.integer('GAS_FEES_FEES_DAYS_PER_QUERY', 10),
    },
    // A rolling year for the page, with a margin
    historyFirstDay: toDay(
      env.string('GAS_FEES_HISTORY_FIRST_DAY', '2025-11-01'),
    ),
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
