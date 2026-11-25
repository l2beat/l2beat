import type { ReactNode } from 'react'
import type { ChartUnit } from '~/components/chart/types'
import {
  type TvlBreakdown,
  toBreakdown,
} from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import type { LiquidStakingChartSeries } from '../LiquidStakingLineChart'

/** What the stack reaches up to: the stake, the supply or the protocols alone. */
export type TvlScope = 'staked' | 'supply' | 'liquid'

/** A band of the stack. */
export interface TvlLayer {
  key: string
  role: 'protocol' | 'others' | 'notStaked'
  label: ReactNode
  fill: string
  stroke?: string
  strokeDasharray?: string
  value: (row: TvlBreakdown) => number | null
  /** The view a click on it switches to; a protocol toggles itself instead. */
  toggleScope?: (scope: TvlScope) => TvlScope
}

/** One per protocol, in the table's order, at the bottom of every view. */
export function getProtocolLayers(
  projectSeries: LiquidStakingChartSeries[],
): TvlLayer[] {
  return projectSeries.map((series) => ({
    key: series.key,
    role: 'protocol',
    label: series.label,
    fill: series.color,
    value: (row) => row.projects[series.key] ?? null,
  }))
}

const OTHERS_LAYER: TvlLayer = {
  key: 'others',
  role: 'others',
  label: 'Others',
  fill: 'color-mix(in oklab, var(--secondary) 28%, transparent)',
  stroke: 'var(--secondary)',
  strokeDasharray: '3 3',
  value: (row) => row.others,
  toggleScope: (scope) => (scope === 'liquid' ? 'staked' : 'liquid'),
}

const NOT_STAKED_LAYER: TvlLayer = {
  key: 'notStaked',
  role: 'notStaked',
  label: 'Not staked',
  // Fainter than Others, so the staked layers stand out inside the supply.
  fill: 'color-mix(in oklab, var(--secondary) 10%, transparent)',
  stroke: 'var(--secondary)',
  value: (row) => row.notStaked,
  toggleScope: (scope) => (scope === 'supply' ? 'staked' : 'supply'),
}

interface TvlView {
  label: string
  /** Stacked above the protocols. */
  layers: TvlLayer[]
  totalLabel: string
  total: (row: TvlBreakdown) => number | null
  /** What a protocol's share in the tooltip is of. */
  protocolShareOf: {
    label: string
    value: (row: TvlBreakdown) => number | null
  }
}

const SHARE_OF_STAKE: TvlView['protocolShareOf'] = {
  label: 'ETH staked',
  value: (row) => row.staked,
}

/** In the order of the view buttons. */
export const VIEWS: Record<TvlScope, TvlView> = {
  staked: {
    label: 'Staked',
    layers: [OTHERS_LAYER],
    totalLabel: 'total ETH staked',
    total: (row) => row.staked,
    protocolShareOf: SHARE_OF_STAKE,
  },
  supply: {
    label: 'vs. Supply',
    layers: [OTHERS_LAYER, NOT_STAKED_LAYER],
    totalLabel: 'total ETH supply',
    total: (row) => row.supply,
    protocolShareOf: SHARE_OF_STAKE,
  },
  liquid: {
    label: 'Liquid only',
    layers: [],
    totalLabel: 'liquid staking TVL',
    total: (row) => row.liquid,
    protocolShareOf: { label: 'Liquid staking', value: (row) => row.liquid },
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

/** In USD, every amount at the day's ETH price, and none without a price. */
export function inUnit(breakdown: TvlBreakdown, unit: ChartUnit): TvlBreakdown {
  if (unit === 'eth') return breakdown
  const price = breakdown.ethPrice
  const convert = (eth: number | null) =>
    eth !== null && price !== null ? eth * price : null
  return toBreakdown({
    ...breakdown,
    projects: Object.fromEntries(
      Object.entries(breakdown.projects).map(([id, eth]) => [id, convert(eth)]),
    ),
    staked: convert(breakdown.staked),
    supply: convert(breakdown.supply),
  })
}
