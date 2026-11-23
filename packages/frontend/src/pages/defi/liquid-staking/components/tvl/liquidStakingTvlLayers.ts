import type { ReactNode } from 'react'
import type { ChartUnit } from '~/components/chart/types'
import type { TvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import type { LiquidStakingChartSeries } from '../LiquidStakingLineChart'

/** What the stack reaches up to: the stake, the supply or the protocols alone. */
export type TvlScope = 'staked' | 'supply' | 'liquid'

export const OTHERS_KEY = 'others'
export const NOT_STAKED_KEY = 'notStaked'

export const OTHERS_COLOR =
  'color-mix(in oklab, var(--secondary) 28%, transparent)'
export const OTHERS_STROKE = 'var(--secondary)'
// Fainter than Others, so the staked layers stand out inside the supply.
export const NOT_STAKED_COLOR =
  'color-mix(in oklab, var(--secondary) 10%, transparent)'

/** A band of the stack. */
export interface TvlLayer {
  key: string
  label: ReactNode
  fill: string
  stroke?: string
  strokeDasharray?: string
  value: (row: TvlBreakdown) => number | null
}

/**
 * The view's bands, bottom up: the protocols in the table's order, then
 * Others, so its upper edge traces the stake, then the ETH not staked, up to
 * the supply.
 */
export function getLayers(
  projectSeries: LiquidStakingChartSeries[],
  scope: TvlScope,
): TvlLayer[] {
  const layers: TvlLayer[] = projectSeries.map((series) => ({
    key: series.key,
    label: series.label,
    fill: series.color,
    value: (row) => row.projects[series.key] ?? null,
  }))
  if (scope !== 'liquid') {
    layers.push({
      key: OTHERS_KEY,
      label: 'Others',
      fill: OTHERS_COLOR,
      stroke: OTHERS_STROKE,
      strokeDasharray: '3 3',
      value: (row) => row.others,
    })
  }
  if (scope === 'supply') {
    layers.push({
      key: NOT_STAKED_KEY,
      label: 'Not staked',
      fill: NOT_STAKED_COLOR,
      stroke: OTHERS_STROKE,
      // Only on a complete stack, so it ends at the supply.
      value: (row) => (row.others !== null ? row.notStaked : null),
    })
  }
  return layers
}

/** The view a click on Others or Not staked switches to; none for a protocol. */
export function getToggledScope(
  scope: TvlScope,
  key: string,
): TvlScope | undefined {
  if (key === OTHERS_KEY) return scope === 'liquid' ? 'staked' : 'liquid'
  if (key === NOT_STAKED_KEY) return scope === 'supply' ? 'staked' : 'supply'
  return undefined
}

/** The total each view's headline shows. */
export const SCOPE_TOTALS: Record<
  TvlScope,
  { label: string; value: (row: TvlBreakdown) => number | null }
> = {
  staked: { label: 'total ETH staked', value: (row) => row.staked },
  supply: { label: 'total ETH supply', value: (row) => row.supply },
  liquid: { label: 'liquid staking TVL', value: (row) => row.liquid },
}

/** In USD, every amount at the day's ETH price, and none without a price. */
export function inUnit(breakdown: TvlBreakdown, unit: ChartUnit): TvlBreakdown {
  if (unit === 'eth') return breakdown
  const price = breakdown.ethPrice
  const convert = (eth: number | null) =>
    eth !== null && price !== null ? eth * price : null
  return {
    ...breakdown,
    projects: Object.fromEntries(
      Object.entries(breakdown.projects).map(([id, eth]) => [id, convert(eth)]),
    ),
    liquid: convert(breakdown.liquid),
    others: convert(breakdown.others),
    staked: convert(breakdown.staked),
    notStaked: convert(breakdown.notStaked),
    supply: convert(breakdown.supply),
  }
}
