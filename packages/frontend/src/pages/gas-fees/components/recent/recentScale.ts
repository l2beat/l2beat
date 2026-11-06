import type {
  GasFeesRecentChain,
  GasFeesRecentSeries,
} from '~/server/features/gas-fees/getGasFeesRecent'
import type { GasFeesUnit } from '~/server/features/gas-fees/types'

/** Where the color saturates above and below a chain's usual fee */
const MAX_ABOVE = 4
const MAX_BELOW = 2
/** Hours this close to usual stay gray */
const NEUTRAL = 1.33
/** Moves this big, either way, are called out */
const NOTABLE = 2

export function getSeries(chain: GasFeesRecentChain, unit: GasFeesUnit) {
  return unit === 'usd' ? chain.usd : chain.gas
}

/** Diverging on a log scale: gray near usual, orange above, sky below */
export function getCellColor(ratio: number) {
  const r = Math.log(ratio)
  const n = Math.log(NEUTRAL)
  const t =
    Math.abs(r) <= n
      ? 0
      : r > 0
        ? Math.min(1, (r - n) / (Math.log(MAX_ABOVE) - n))
        : Math.max(-1, (r + n) / (Math.log(MAX_BELOW) - n))
  const hue = t >= 0 ? 'var(--chart-orange)' : 'var(--chart-sky)'
  const share = Math.round(Math.abs(t) * 100)
  return `color-mix(in oklab, ${hue} ${share}%, var(--surface-secondary))`
}

export const LEGEND_GRADIENT = `linear-gradient(to right, ${getCellColor(1 / MAX_BELOW)}, ${getCellColor(1)} 35%, ${getCellColor(1)} 50%, ${getCellColor(MAX_ABOVE)})`

export function getRatio(series: GasFeesRecentSeries, hour: number) {
  return (series.values[hour] ?? series.usual) / series.usual
}

export function isNotable(ratio: number) {
  return ratio >= NOTABLE || ratio <= 1 / NOTABLE
}

export function isAbove(ratio: number) {
  return ratio > NEUTRAL
}

export function isBelow(ratio: number) {
  return ratio < 1 / NEUTRAL
}

export function formatHour(timestamp: number) {
  const hours = new Date(timestamp * 1000).getUTCHours()
  return `${String(hours).padStart(2, '0')}:00`
}
