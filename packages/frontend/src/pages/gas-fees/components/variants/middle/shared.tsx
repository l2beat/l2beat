import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import type { GasFeesChartData } from '~/server/features/gas-fees/getGasFeesChart'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type {
  GasFeesMetric,
  GasFeesUnit,
} from '~/server/features/gas-fees/types'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { GasFeesScale } from '../../GasFeesView'
import { GAS_FEES_RANGE_OPTIONS } from '../../metrics'
import type { GasFeesChain } from '../../types'

/**
 * Everything the "Ethereum vs L2s" card needs from GasFeesView. Every middle
 * variant takes these props.
 */
export interface MiddleCardProps {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  /** The stats' query: a fixed past year */
  summary: {
    data: GasFeesSummary | undefined
    isLoading: boolean
    /** The range of the data on screen */
    range: ChartRange
  }
  /** The fee history's query */
  chart: {
    data: GasFeesChartData | undefined
    isLoading: boolean
    isPlaceholderData: boolean
    /** The range of the data on screen, which lags `range` while it loads */
    range: ChartRange
    /** The metric of the data on screen, which lags `metric` while it loads */
    metric: GasFeesMetric
  }
  range: ChartRange
  setRange: (range: ChartRange) => void
  unit: GasFeesUnit
  setUnit: (unit: GasFeesUnit) => void
  metric: GasFeesMetric
  setMetric: (metric: GasFeesMetric) => void
  scale: GasFeesScale
  setScale: (scale: GasFeesScale) => void
  /** Hovered in the table below */
  highlightedChainId: string | undefined
  highlightedUpgradeId: string | undefined
  setHighlightedUpgradeId: (id: string | undefined) => void
  selectedUpgradeId: string | undefined
  setSelectedUpgradeId: (id: string | undefined) => void
}

export const RANGE_LABELS: Record<
  (typeof GAS_FEES_RANGE_OPTIONS)[number],
  string
> = {
  '7d': '7D',
  '30d': '30D',
  '90d': '90D',
  '1y': '1Y',
  max: 'Max',
}

export function RangeControl({
  range,
  setRange,
}: {
  range: ChartRange
  setRange: (range: ChartRange) => void
}) {
  return (
    <ChartRangeControls
      name="gasFeesRange"
      value={range}
      setValue={setRange}
      options={GAS_FEES_RANGE_OPTIONS.map((value) => ({
        value,
        label: RANGE_LABELS[value],
      }))}
    />
  )
}

export type Figures = ReturnType<typeof getFigures>

/** The stats' figures, as GasFeesStats derives them */
export function getFigures(stats: GasFeesSummary['stats'], period: string) {
  const { ethereum, l2s, latestErc20 } = stats
  const txCount = ethereum.txCount + l2s.txCount
  const fees = ethereum.fees + l2s.fees
  const ethFees = l2s.feesByToken.find((t) => t.token === 'ETH')?.fees ?? 0
  const avgFee = {
    ethereum: ethereum.txCount > 0 ? ethereum.fees / ethereum.txCount : 0,
    l2s: l2s.txCount > 0 ? l2s.fees / l2s.txCount : 0,
  }
  return {
    period,
    ethereum,
    l2s,
    txShare: txCount > 0 ? l2s.txCount / txCount : 0,
    feeShare: fees > 0 ? l2s.fees / fees : 0,
    ethShare: l2s.fees > 0 ? ethFees / l2s.fees : 0,
    avgFee,
    avgRatio: avgFee.l2s > 0 ? avgFee.ethereum / avgFee.l2s : 0,
    erc20: latestErc20,
    erc20Date: formatTimestamp(latestErc20.timestamp),
    timesCheaper:
      latestErc20.l2s > 0 ? latestErc20.ethereum / latestErc20.l2s : 0,
  }
}

/** Gas tokens other than ETH, in the pink the product uses for them */
export const OTHER_TOKEN = 'var(--chart-stacked-pink)'

export function tokenColor(token: string) {
  return token === 'ETH' ? 'var(--chart-ethereum)' : OTHER_TOKEN
}

export function isUpgradeInRange(upgrade: GasFeesUpgrade, range: ChartRange) {
  const [from, to] = range
  return (
    upgrade.timestamp !== null &&
    (from === null || upgrade.timestamp >= from) &&
    upgrade.timestamp < to
  )
}
