import { useCallback, useState } from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  type GasFeesGasMetric,
  type GasFeesMetric,
  type GasFeesUnit,
  type GasFeesUsdMetric,
  isGasMetric,
} from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesTipping } from './GasFeesTipping'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import {
  DEFAULT_GAS_FEES_GAS_METRIC,
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
import type { GasFeesChain } from './types'

export type GasFeesScale = 'log' | 'lin'

const RANGE_LABELS: Record<(typeof GAS_FEES_RANGE_OPTIONS)[number], string> = {
  '7d': '7D',
  '30d': '30D',
  '90d': '90D',
  '1y': '1Y',
  max: 'Max',
}

interface Props {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  initialRange: ChartRange
}

export function GasFeesView({ chains, upgrades, initialRange }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState(initialRange)
  // The chart and the stats above it open on the whole history, the table
  // on recent fees
  const [tableRange, setTableRange] = useState(() => optionToRange('30d'))
  const [unit, setUnit] = useState<GasFeesUnit>('usd')
  // Each unit keeps its own metric, so switching back restores it
  const [usdMetric, setUsdMetric] = useState<GasFeesUsdMetric>(
    DEFAULT_GAS_FEES_METRIC,
  )
  const [gasMetric, setGasMetric] = useState<GasFeesGasMetric>(
    DEFAULT_GAS_FEES_GAS_METRIC,
  )
  const metric = unit === 'usd' ? usdMetric : gasMetric
  const setMetric = (m: GasFeesMetric) =>
    isGasMetric(m) ? setGasMetric(m) : setUsdMetric(m)
  const [scale, setScale] = useState<GasFeesScale>('log')
  // The chain hovered in the table is highlighted on the chart
  const [highlightedChainId, setHighlightedChainId] = useState<string>()
  const [highlightedUpgradeId, setHighlightedUpgradeId] = useState<string>()

  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })
  const summary = useChartQuery(trpc.gasFees.summary, { range })
  const tableSummary = useChartQuery(trpc.gasFees.summary, {
    range: tableRange,
  })
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])
  const shownMetric = chart.shownInput.metric

  const rangeControls = (
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

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <PrimaryCard>
        <GasFeesTipping />
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesStats
          stats={summary.data?.stats}
          range={summary.shownInput.range}
          isLoading={summary.isLoading}
        />
      </PrimaryCard>
      {/* The upgrades sit beside the chart, cut to its height */}
      <div className="grid grid-cols-1 md:gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <PrimaryCard>
          <GasFeesChart
            chains={chains}
            upgrades={upgrades}
            data={chart.data}
            isLoading={chart.isLoading}
            isPlaceholderData={chart.isPlaceholderData}
            shownMetric={shownMetric}
            metric={metric}
            setMetric={setMetric}
            scale={scale}
            setScale={setScale}
            highlightedChainId={highlightedChainId}
            highlightedUpgradeId={highlightedUpgradeId}
            unit={unit}
            setUnit={setUnit}
            rangeControl={rangeControls}
          />
        </PrimaryCard>
        <PrimaryCard className="relative max-lg:h-[480px]">
          <div className="absolute inset-0 p-4 md:px-6 md:py-5">
            <GasFeesUpgrades
              upgrades={upgrades}
              metric={isGasMetric(shownMetric) ? undefined : shownMetric}
              range={chart.shownInput.range}
              highlightedUpgradeId={highlightedUpgradeId}
              setHighlightedUpgradeId={setHighlightedUpgradeId}
              showWholeHistory={showWholeHistory}
            />
          </div>
        </PrimaryCard>
      </div>
      <PrimaryCard>
        <GasFeesTable
          chains={chains}
          summary={tableSummary.data}
          isLoading={tableSummary.isLoading}
          period={getPeriodLabel(tableSummary.shownInput.range)}
          rangeControl={
            <RadioGroup
              name="gasFeesTableRange"
              value={rangeToOption(tableRange, GAS_FEES_RANGE_OPTIONS)}
              onValueChange={(value) =>
                setTableRange(
                  optionToRange(
                    value as (typeof GAS_FEES_RANGE_OPTIONS)[number],
                  ),
                )
              }
            >
              {GAS_FEES_RANGE_OPTIONS.map((option) => (
                <RadioGroupItem key={option} value={option}>
                  {option === 'max' ? 'All' : RANGE_LABELS[option]}
                </RadioGroupItem>
              ))}
            </RadioGroup>
          }
          highlightedChainId={highlightedChainId}
          setHighlightedChainId={setHighlightedChainId}
        />
      </PrimaryCard>
    </div>
  )
}
