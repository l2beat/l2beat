import type { PriceOfSpeed } from '~/server/features/gas-fees/tipping/toPriceOfSpeed'
import { formatSeconds } from '../../utils/format'

interface SpeedGain {
  /** The tip our fast tip is set against */
  gwei: number
  /** What it adds over our estimated fast tip, USD */
  extraUsd: number
  /** "8s sooner" or "no sooner" */
  gain: string
  /** "25s to 17s", "25s either way" or "25s and 26s" */
  waits: string
}

/** Needs both waits and a positive extra cost */
export function getSpeedGain(speed: PriceOfSpeed): SpeedGain | undefined {
  const tip = speed.comparisonTip
  const fast = speed.fastTip
  if (!tip || fast?.seconds === undefined) return undefined
  const extraUsd = tip.usd - fast.usd
  if (!(extraUsd > 0)) return undefined
  const from = Math.round(fast.seconds)
  const to = Math.round(tip.seconds)
  if (to < from) {
    return {
      gwei: tip.gwei,
      extraUsd,
      gain: `${formatSeconds(from - to)} sooner`,
      waits: `${formatSeconds(from)} to ${formatSeconds(to)}`,
    }
  }
  return {
    gwei: tip.gwei,
    extraUsd,
    gain: 'no sooner',
    waits:
      to === from
        ? `${formatSeconds(from)} either way`
        : `${formatSeconds(from)} and ${formatSeconds(to)}`,
  }
}
