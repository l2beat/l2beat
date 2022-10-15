import {
  ActivityResponse,
  AggregateTvlResponse,
  TokenTvlResponse,
} from '../../../../../src/components/chart/configure2/state/State'

export const NOW = 1665792000 // Sat Oct 15 2022 00:00:00 GMT+0000

const HOUR = 60 * 60
const SIX_HOURS = 6 * HOUR
const DAY = 24 * HOUR

export const EXAMPLE_AGGREGATE_TVL_DATA: AggregateTvlResponse = {
  hourly: {
    types: ['timestamp', 'usd', 'eth'],
    data: new Array(7 * 24)
      .fill(0)
      .map((x, i) => [NOW - i * HOUR, 10_000 - 10 * i, 1000 - i]),
  },
  sixHourly: {
    types: ['timestamp', 'usd', 'eth'],
    data: new Array(90 * 4)
      .fill(0)
      .map((x, i) => [NOW - i * SIX_HOURS, 10_000 - 10 * i, 1000 - i]),
  },
  daily: {
    types: ['timestamp', 'usd', 'eth'],
    data: new Array(365 * 2)
      .fill(0)
      .map((x, i) => [NOW - i * DAY, 10_000 - 10 * i, 1000 - i]),
  },
}

export const EXAMPLE_TOKEN_TVL_DATA: TokenTvlResponse = {
  hourly: {
    types: ['timestamp', 'balance', 'usd'],
    data: new Array(7 * 24)
      .fill(0)
      .map((x, i) => [NOW - i * HOUR, 1000 - i, 10_000 - 10 * i]),
  },
  sixHourly: {
    types: ['timestamp', 'balance', 'usd'],
    data: new Array(90 * 4)
      .fill(0)
      .map((x, i) => [NOW - i * SIX_HOURS, 1000 - i, 10_000 - 10 * i]),
  },
  daily: {
    types: ['timestamp', 'balance', 'usd'],
    data: new Array(365 * 2)
      .fill(0)
      .map((x, i) => [NOW - i * DAY, 1000 - i, 10_000 - 10 * i]),
  },
}

export const EXAMPLE_ACTIVITY_RESPONSE: ActivityResponse = {
  daily: {
    types: ['timestamp', 'transactions', 'ethereumTransactions'],
    data: new Array(365 * 2)
      .fill(0)
      .map((x, i) => [NOW - i * DAY, 10 - i / 100, 20 - i / 100]),
  },
}
