import type { GasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'

type RecentChain = GasFeesRecent['chains'][number]

/** Where the color saturates above and below a chain's usual fee */
const MAX_ABOVE = 4
const MAX_BELOW = 2
/** Hours this close to usual stay gray */
export const NEUTRAL = 1.33
/** Moves this big, either way, are called out */
export const NOTABLE = 2

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

/** Bars sit on the card, so usual hours get a solid neutral */
export function getBarColor(ratio: number) {
  if (ratio > NEUTRAL) return 'var(--chart-orange)'
  if (ratio < 1 / NEUTRAL) return 'var(--chart-sky)'
  return 'color-mix(in oklab, var(--secondary) 45%, var(--surface-primary))'
}

export const LEGEND_GRADIENT = `linear-gradient(to right, ${getCellColor(1 / MAX_BELOW)}, ${getCellColor(1)} 35%, ${getCellColor(1)} 50%, ${getCellColor(MAX_ABOVE)})`

export function getRatio(chain: RecentChain, hour: number) {
  return (chain.avgFee[hour] ?? chain.usual) / chain.usual
}

/** The hour a chain strayed furthest from usual, either way */
export function getBiggestMove(chain: RecentChain) {
  let hour = 0
  chain.avgFee.forEach((_, i) => {
    if (
      Math.abs(Math.log(getRatio(chain, i))) >
      Math.abs(Math.log(getRatio(chain, hour)))
    ) {
      hour = i
    }
  })
  return { hour, ratio: getRatio(chain, hour) }
}

export function isNotable(ratio: number) {
  return ratio >= NOTABLE || ratio <= 1 / NOTABLE
}

export function formatGwei(value: number) {
  if (value >= 10) return value.toFixed(0)
  if (value >= 1) return value.toFixed(1)
  return `${Number(value.toPrecision(2))}`
}

export function formatHour(timestamp: number) {
  const hours = new Date(timestamp * 1000).getUTCHours()
  return `${String(hours).padStart(2, '0')}:00`
}
