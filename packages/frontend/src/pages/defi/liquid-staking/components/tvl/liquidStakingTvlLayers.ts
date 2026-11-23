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

/** A band of the stack. */
export interface TvlLayer {
  key: string
  label: ReactNode
  fill: string
  stroke?: string
  strokeDasharray?: string
  value: (row: TvlBreakdown) => number | null
}

/** One per protocol, in the table's order, at the bottom of every view. */
export function getProtocolLayers(
  projectSeries: LiquidStakingChartSeries[],
): TvlLayer[] {
  return projectSeries.map((series) => ({
    key: series.key,
    label: series.label,
    fill: series.color,
    value: (row) => row.projects[series.key] ?? null,
  }))
}

const OTHERS_LAYER: TvlLayer = {
  key: OTHERS_KEY,
  label: 'Others',
  fill: OTHERS_COLOR,
  stroke: OTHERS_STROKE,
  strokeDasharray: '3 3',
  value: (row) => row.others,
}

const NOT_STAKED_LAYER: TvlLayer = {
  key: NOT_STAKED_KEY,
  label: 'Not staked',
  // Fainter than Others, so the staked layers stand out inside the supply.
  fill: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
  stroke: OTHERS_STROKE,
  value: (row) => row.notStaked,
}

/**
 * Each view: the layers it stacks above the protocols, and the total its
 * headline shows. Others traces the stake, Not staked reaches the supply.
 */
export const VIEWS: Record<
  TvlScope,
  {
    layers: TvlLayer[]
    totalLabel: string
    total: (row: TvlBreakdown) => number | null
  }
> = {
  staked: {
    layers: [OTHERS_LAYER],
    totalLabel: 'total ETH staked',
    total: (row) => row.staked,
  },
  supply: {
    layers: [OTHERS_LAYER, NOT_STAKED_LAYER],
    totalLabel: 'total ETH supply',
    total: (row) => row.supply,
  },
  liquid: {
    layers: [],
    totalLabel: 'liquid staking TVL',
    total: (row) => row.liquid,
  },
}

/**
 * Each layer only where every one below it has a value: without them it has
 * no base, and would be drawn as if the missing ETH were gone.
 */
export function stackOnKnown(layers: TvlLayer[]): TvlLayer[] {
  return layers.map((layer, i) => ({
    ...layer,
    value: (row) =>
      layers.slice(0, i).every((below) => below.value(row) !== null)
        ? layer.value(row)
        : null,
  }))
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
