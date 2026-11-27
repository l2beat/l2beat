import type { GasFeesTipPayersDailyRecord } from '@l2beat/database'
import { GAS_FEES_TIP_BANDS, type GasFeesTipBand } from '@l2beat/shared-pure'
import { type DayPeriod, toDayPeriod } from '../days'
import { sum } from '../math'

/** Ordinary tips' bands, lowest first */
export const TIP_BANDS = Object.keys(GAS_FEES_TIP_BANDS) as GasFeesTipBand[]

export interface TipPayers {
  period: DayPeriod
  /** Ordinary tips, each day's ETH at that day's price */
  ordinaryUsd: number
  /** The part of them up to our estimated fast tip */
  atFastTipUsd: number
  /** The rest: what went above it */
  aboveFastTipUsd: number
  bands: Record<GasFeesTipBand, { txShare: number; tipShare: number }>
}

/** Complete days only; undefined without one */
export function toTipPayers(
  records: GasFeesTipPayersDailyRecord[],
): TipPayers | undefined {
  const days = records.flatMap((r) => (r.status === 'complete' ? [r] : []))
  const period = toDayPeriod(days.map((d) => d.timestamp))
  if (!period) return undefined
  const bandUsd = (band: GasFeesTipBand) =>
    sum(days.map((d) => d[band].tipEth * d.ethUsd))
  const bandTxs = (band: GasFeesTipBand) =>
    sum(days.map((d) => d[band].txCount))
  const ordinaryUsd = sum(TIP_BANDS.map(bandUsd))
  const ordinaryTxs = sum(TIP_BANDS.map(bandTxs))
  const share = (part: number, whole: number) => (whole > 0 ? part / whole : 0)
  const atFastTipUsd = sum(days.map((d) => d.atFastTipEth * d.ethUsd))
  return {
    period,
    ordinaryUsd,
    atFastTipUsd,
    aboveFastTipUsd: ordinaryUsd - atFastTipUsd,
    bands: Object.fromEntries(
      TIP_BANDS.map((band) => [
        band,
        {
          txShare: share(bandTxs(band), ordinaryTxs),
          tipShare: share(bandUsd(band), ordinaryUsd),
        },
      ]),
    ) as TipPayers['bands'],
  }
}
