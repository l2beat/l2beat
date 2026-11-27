import type { GasFeesTipPayersDailyRecord } from '@l2beat/database'
import { type DayPeriod, toDayPeriod } from '../days'
import { sum } from '../math'

export const TIP_BANDS = ['low', 'middle', 'high'] as const
/** Ordinary tips: under 0.1 gwei, 0.1 to 1, 1 to 2.5 */
export type TipBand = (typeof TIP_BANDS)[number]

export interface TipPayers {
  period: DayPeriod
  /** Ordinary tips, each day's ETH at that day's price */
  ordinaryUsd: number
  /** The part of them up to our estimated fast tip */
  atFastTipUsd: number
  bands: Record<TipBand, { txShare: number; tipShare: number }>
}

/** Complete days only; undefined without one */
export function toTipPayers(
  records: GasFeesTipPayersDailyRecord[],
): TipPayers | undefined {
  const days = records.flatMap((r) => (r.status === 'complete' ? [r] : []))
  const period = toDayPeriod(days.map((d) => d.timestamp))
  if (!period) return undefined
  const bandUsd = (band: TipBand) =>
    sum(days.map((d) => d[band].tipEth * d.ethUsd))
  const bandTxs = (band: TipBand) => sum(days.map((d) => d[band].txCount))
  const ordinaryUsd = sum(TIP_BANDS.map(bandUsd))
  const ordinaryTxs = sum(TIP_BANDS.map(bandTxs))
  const share = (part: number, whole: number) => (whole > 0 ? part / whole : 0)
  return {
    period,
    ordinaryUsd,
    atFastTipUsd: sum(days.map((d) => d.atFastTipEth * d.ethUsd)),
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
