import { formatCurrency } from '@l2beat/shared-pure'
import type { GasFeesPeriod } from '~/server/features/gas-fees/getGasFeesTipping'
import { formatTimestamp } from '~/utils/dates'
import { getFirstTwoNonZeroPrecision } from '~/utils/getFirstTwoNonZeroPrecision'

/** Two significant digits below a dollar: fees span $100 to a hundredth of a cent */
export function formatFee(value: number) {
  // Without a nonzero digit to find, the precision runs away
  if (value === 0) return formatCurrency(0, 'usd', { decimals: 2 })
  if (value >= 1) return formatCurrency(value, 'usd')
  return formatCurrency(value, 'usd', {
    decimals: Math.max(2, getFirstTwoNonZeroPrecision(value)),
  })
}

/** For log axis ticks, which are powers of ten: "$0.001", not "$0.0010" */
export function formatFeeTick(value: number) {
  if (value >= 1) return formatCurrency(value, 'usd', { decimals: 0 })
  return `$${formatSignificant(value, 1)}`
}

/** Never in e-notation: a tip or an L2's gas price can be 1e-8 gwei */
export function formatSignificant(value: number, digits: number) {
  return value.toLocaleString('en-US', { maximumSignificantDigits: digits })
}

/** Per gas: "24 gwei", "0.012 gwei" */
export function formatGasPrice(value: number) {
  return `${formatGasNumber(value)} gwei`
}

export function formatGasNumber(value: number) {
  if (value >= 10_000) {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumSignificantDigits: 3,
    }).format(value)
  }
  if (value >= 100) return value.toFixed(0)
  if (value >= 10) return value.toFixed(1)
  if (value >= 1) return value.toFixed(2)
  return formatSignificant(value, 2)
}

export function formatGasPriceTick(value: number) {
  return formatSignificant(value, 1)
}

function formatTimes(value: number) {
  return `${value >= 10 ? Math.round(value).toLocaleString('en-US') : value.toFixed(1)}×`
}

/** Ethereum's cost over a chain's, worded by which of the two is lower */
export function compareWithEthereum(times: number) {
  if (!Number.isFinite(times) || times <= 0) return undefined
  return times >= 1
    ? { times: formatTimes(times), word: 'cheaper', amount: 'less' }
    : { times: formatTimes(1 / times), word: 'more expensive', amount: 'more' }
}

/** A wallet's tip over ours, to two digits: both move with every block */
export const formatMultiple = (value: number) =>
  `${Number(value.toPrecision(2)).toLocaleString('en-US')}×`

export const formatGwei = (value: number) => formatSignificant(value, 2)

export function usd(value: number) {
  return formatCurrency(value, 'usd', { decimals: 1 })
}

/**
 * Whole percents from 10% to 99%, one decimal outside that, so 99.7% never
 * rounds up to a 100% that sits beside a 0.3%
 */
export function percent(share: number) {
  const pct = share * 100
  if (pct === 0 || pct === 100) return `${pct}%`
  if (pct < 0.1) return '<0.1%'
  if (pct > 99.9) return '>99.9%'
  return `${pct >= 10 && pct <= 99 ? Math.round(pct) : pct.toFixed(1)}%`
}

export function formatPeriodDays(period: GasFeesPeriod) {
  return `${formatTimestamp(period.from)} to ${formatTimestamp(period.to)}`
}

/** The days a figure covers, and how many of them are left out because Dune doesn't have them whole */
export function formatPeriod(period: GasFeesPeriod) {
  const days = formatPeriodDays(period)
  if (period.missingDays === 0) return days
  return `${days}, without ${period.missingDays} ${period.missingDays === 1 ? 'day' : 'days'} of incomplete data`
}
