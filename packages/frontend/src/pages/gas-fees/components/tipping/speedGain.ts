import type { PriceOfSpeed } from '~/server/features/gas-fees/tipping/toPriceOfSpeed'
import { formatSeconds } from '../../utils/format'

interface SpeedGain {
  /** What 2 gwei adds over our estimated fast tip, USD */
  extraUsd: number
  /** "8s sooner" or "no sooner" */
  gain: string
  /** "25s to 17s", "25s either way" or "25s and 26s" */
  waits: string
}

/** Needs both waits and a positive extra cost */
export function getSpeedGain(speed: PriceOfSpeed): SpeedGain | undefined {
  const twoGwei = speed.roundTips.find((t) => t.gwei === 2)
  const fast = speed.fastTip
  if (!twoGwei || fast?.seconds === undefined) return undefined
  const extraUsd = twoGwei.usd - fast.usd
  if (!(extraUsd > 0)) return undefined
  const from = Math.round(fast.seconds)
  const to = Math.round(twoGwei.seconds)
  if (to < from) {
    return {
      extraUsd,
      gain: `${formatSeconds(from - to)} sooner`,
      waits: `${formatSeconds(from)} to ${formatSeconds(to)}`,
    }
  }
  return {
    extraUsd,
    gain: 'no sooner',
    waits:
      to === from
        ? `${formatSeconds(from)} either way`
        : `${formatSeconds(from)} and ${formatSeconds(to)}`,
  }
}
