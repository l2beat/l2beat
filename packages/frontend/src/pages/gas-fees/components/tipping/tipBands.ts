import { GAS_FEES_TIP_BANDS, type GasFeesTipBand } from '@l2beat/shared-pure'
import { TIP_BANDS } from '~/server/features/gas-fees/tipping/toTipPayers'

const COLORS: Record<GasFeesTipBand, string> = {
  low: 'var(--chart-stacked-blue)',
  middle: 'var(--chart-stacked-purple)',
  high: 'var(--chart-stacked-pink)',
}

/** Ordinary tips' bands, as the tip payers' table splits them */
export const TIP_BAND_STYLE = Object.fromEntries(
  TIP_BANDS.map((band) => {
    const [fromGwei, toGwei] = GAS_FEES_TIP_BANDS[band]
    const label =
      fromGwei === 0 ? `Under ${toGwei} gwei` : `${fromGwei} to ${toGwei} gwei`
    return [band, { label, color: COLORS[band], fromGwei, toGwei }]
  }),
) as Record<
  GasFeesTipBand,
  { label: string; color: string; fromGwei: number; toGwei: number }
>

/** The band a tip falls in: each band starts at its lower bound */
export function tipBandOf(gwei: number): GasFeesTipBand | undefined {
  return TIP_BANDS.find(
    (band) =>
      gwei >= TIP_BAND_STYLE[band].fromGwei &&
      gwei < TIP_BAND_STYLE[band].toGwei,
  )
}
