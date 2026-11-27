import type { TipBand } from '~/server/features/gas-fees/tipping/toTipPayers'

/** Ordinary tips' bands, as the tip payers' table splits them */
export const TIP_BAND_STYLE: Record<
  TipBand,
  { label: string; color: string; fromGwei: number; toGwei: number }
> = {
  low: {
    label: 'Under 0.1 gwei',
    color: 'var(--chart-stacked-blue)',
    fromGwei: 0,
    toGwei: 0.1,
  },
  middle: {
    label: '0.1 to 1 gwei',
    color: 'var(--chart-stacked-purple)',
    fromGwei: 0.1,
    toGwei: 1,
  },
  high: {
    label: '1 to 2.5 gwei',
    color: 'var(--chart-stacked-pink)',
    fromGwei: 1,
    toGwei: 2.5,
  },
}
